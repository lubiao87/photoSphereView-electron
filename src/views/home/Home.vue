<template>
  <div class="home">
    <headers :pageName="'win'" />
    <div id="myThree" class="myThree"></div>
    <div id="myToolBar" class="myToolBar">
      <el-button
        v-for="(item, index) in myToolBar"
        :key="String(index) + item.active"
        :icon="item.icon"
        @click="myToolBarClick(item)"
        :class="{ active: item.active }"
      >
        {{ item.name }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { SceneToPano } from "../../cubepano/SceneToPano";
// import fs from "fs";
// const { Op } = require("sequelize");
import { listSearchMixin } from "../../mixin"; //混淆请求
import headers from "@/components/header";

export default {
  name: "home",
  mixins: [listSearchMixin],
  components: {
    headers,
  },
  inject: ["reload"],
  data: function () {
    return {
      myToolBar: [
        {
          name: "踩点",
          icon: "el-icon-add-location",
          active: false,
        },
        {
          name: "生成",
          icon: "el-icon-sold-out",
          active: false,
        },
        {
          name: "成果",
          icon: "el-icon-view",
          active: false,
        },
        {
          name: "关闭",
          icon: "el-icon-switch-button",
          active: false,
        },
      ],
      characters: [],
      pointList: [],
      imageIndex: 0,
    };
  },
  created() {
    this.pointList = JSON.parse(localStorage.getItem("pointList")) || [];
    this.imageIndex = JSON.parse(localStorage.getItem("imageIndex")) || 0;
  },
  mounted() {
    this.init();
    this.animate();
  },
  methods: {
    init() {
      const container = document.getElementById("myThree");
      this.threeDom = container;
      this.mouse = new window.THREE.Vector2();
      this.raycaster = new window.THREE.Raycaster();
      // document.body.appendChild(container);
      container.innerHTML = "";
      this.camera = new window.THREE.PerspectiveCamera(
        45,
        this.threeDom.getBoundingClientRect().width /
          this.threeDom.getBoundingClientRect().height,
        1,
        20000
      );
      this.camera.position.set(0, 120, 100);

      this.clock = new window.THREE.Clock();
      this.scene = new window.THREE.Scene();
      this.scene.background = new window.THREE.Color(0xffffff);
      this.scene.fog = new window.THREE.Fog(0xffffff, 1000, 4000);

      // var target = new window.THREE.Vector3( 1000, 0, 0 );
      // this.camera.lookAt(target);
      // this.camera.updateProjectionMatrix();
      var axesHelper = new window.THREE.AxesHelper(1000);
      this.scene.add(axesHelper);

      const hemiLight = new window.THREE.HemisphereLight(0xffffff, 0x444444);
      hemiLight.position.set(0, 200, 0);
      this.scene.add(hemiLight);

      // const dirLight = new window.THREE.DirectionalLight(0xffffff);
      // dirLight.position.set(0, 200, 100);
      // dirLight.castShadow = true;

      // dirLight.shadow.mapSize.width = 1024;
      // dirLight.shadow.mapSize.height = 512;
      // dirLight.shadow.camera.near = 100;
      // dirLight.shadow.camera.far = 1200;

      // dirLight.shadow.camera.top = 180;
      // dirLight.shadow.camera.bottom = -100;
      // dirLight.shadow.camera.left = -120;
      // dirLight.shadow.camera.right = 120;
      // this.scene.add(dirLight);

      // scene.add( new window.THREE.CameraHelper( dirLight.shadow.camera ) );

      var gt = new window.THREE.TextureLoader().load(
        "textures/grasslight-big.jpg"
      );
      var gg = new window.THREE.PlaneBufferGeometry(16000, 16000);
      var gm = new window.THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

      var ground = new window.THREE.Mesh(gg, gm);
      ground.rotation.x = -Math.PI / 2;
      ground.material.map.repeat.set(64, 64);
      ground.material.map.wrapS = window.THREE.RepeatWrapping;
      ground.material.map.wrapT = window.THREE.RepeatWrapping;
      ground.position.y = -10;
      // note this because the ground does not cast a shadow, .castShadow is left false
      ground.receiveShadow = true;

      this.scene.add(ground);

      // model
      const loader = new window.THREE.FBXLoader();
      loader.load("fbx/building.fbx", (object) => {
        // mixer = new window.THREE.AnimationMixer( object );

        // const action = mixer.clipAction( object.animations[ 0 ] );
        // action.play();
        object.scale.set(0.01, 0.01, 0.01);
        object.traverse(function (child) {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        this.objectMeth = object;
        this.scene.add(object);
        if (
          this.imageIndex !== undefined &&
          this.imageIndex < this.pointList.length
        ) {
          setTimeout(() => {
            this.generateImage();
          }, 400);
        }

        this.addControls(); // 打篮球
      });

      this.renderer = new window.THREE.WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(
        this.threeDom.getBoundingClientRect().width,
        this.threeDom.getBoundingClientRect().height
      );
      // renderer.shadowMap.enabled = true;
      container.appendChild(this.renderer.domElement);

      this.renderer.gammaInput = true;
      this.renderer.gammaOutput = true;

      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = window.THREE.PCFSoftShadowMap;

      this.controls = new window.THREE.OrbitControls(
        this.camera,
        this.renderer.domElement
      );
      this.controls.target.set(0, 120, 18);
      this.controls.minPolarAngle = Math.PI / 3;
      this.controls.maxPolarAngle = Math.PI;
      this.controls.zoomSpeed = 5.0;
      this.controls.panSpeed = 10.0;
      //按键触发平移的速度
      this.controls.keyPanSpeed = 1000.0;
      this.controls.update();
      this.equi = new SceneToPano(this.renderer, true);
      // this.camera.rotateX(Math.PI);
      this.renderer.render(this.scene, this.camera);
      window.addEventListener("resize", this.onWindowResize, false);

      // stats
      // stats = new Stats();
      // container.appendChild( stats.dom );
    },
    animate() {
      // this.camera.rotateX(0.01);
      requestAnimationFrame(this.animate);

      const delta = this.clock.getDelta();

      if (this.mixer) this.mixer.update(delta);

      this.renderer.render(this.scene, this.camera);
      if (this.nCharacters) {
        this.characters[0].update(delta);
      }

      // stats.update();
    },
    onWindowResize() {
      this.camera.aspect =
        this.threeDom.getBoundingClientRect().width /
        this.threeDom.getBoundingClientRect().height;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(
        this.threeDom.getBoundingClientRect().width,
        this.threeDom.getBoundingClientRect().height
      );
    },
    toMapPoint() {
      this.timeStart = new Date();
      this.threeDom.removeEventListener("mouseup", this.mouseupEvent, false);
      this.threeDom.addEventListener("mouseup", this.mouseupEvent, false);
    },
    mouseupEvent(event) {
      this.timeEnd = new Date();
      if (this.timeEnd - this.timeStart < 400) {
        this.setIntersects(event, this.objectMeth.children, (intersects) => {
          console.log(this.objectMeth.children, intersects);
          if (intersects.length > 0) {
            let point = intersects[0].point;
            let n = 0,
              m = 0;
            if (point.x - this.camera.position.x > 0) {
              n = 2;
            } else {
              n = -2;
            }
            if (point.z - this.camera.position.z > 0) {
              m = 2;
            } else {
              m = -2;
            }
            this.controls.target.set(point.x + n, point.y + 100, point.z + m);
            this.camera.lookAt(point.x + n, point.y + 100, point.z + m);

            this.controls.update();
            this.camera.position.set(point.x, point.y + 100, point.z);
            this.renderer.render(this.scene, this.camera);
            // let planeMesh = this.addplaneMesh(intersects[0].point);
            // this.scene.add(planeMesh);
          }
        });
        console.log("params");
      }
    },
    myToolBarClick(item) {
      const that = this;
      switch (item.name) {
        case "生成":
          this.imageIndex = 0;
          localStorage.setItem("imageIndex", 0);
          this.generateImage();
          // window.imageName = "myimage" + this.imageIndex;
          // this.equi.update(this.camera, this.scene, function (params) {
          //   console.log(params);
          //   that.reload();
          // });
          break;
        case "成果":
          window.ipcRenderer.send("route", "photoSphere");
          break;
        case "踩点":
          item.active = !item.active;
          this.threeDom.removeEventListener(
            "mousedown",
            this.toMapPoint,
            false
          );
          this.threeDom.style.cursor = "auto";
          document.onkeydown = null;
          this.pointList = [];
          localStorage.removeItem("pointList");
          if (item.active) {
            that.camera.position.y = 100;
            let position = that.camera.position;
            this.controls.target.set(
              position.x + 1,
              position.y,
              position.z + 1
            );
            this.controls.update();
            document.onkeydown = function (event) {
              //在全局中绑定按下事件

              var e = event || window.e;

              var keyCode = e.keyCode || e.which;

              switch (keyCode) {
                case 32:
                  {
                    let position = new window.THREE.Vector3() 
                    let rotation = new window.THREE.Vector3() 
                    position.copy(that.camera.position) 
                    rotation.copy(that.camera.rotation) 
                    let point = new window.THREE.Vector3(
                      position.x,
                      position.y - 100,
                      position.z
                    );
                    that.pointList.push({
                      position,
                      rotation
                    });
                    console.log(that.pointList);
                    localStorage.setItem(
                      "pointList",
                      JSON.stringify(that.pointList)
                    );
                    let planeMesh = that.addplaneMesh(point);
                    that.scene.add(planeMesh);
                  }
                  break;

                default:
                  break;
              }
            };
            this.threeDom.style.cursor = "crosshair";
            this.threeDom.addEventListener("mousedown", this.toMapPoint, false);
          }

          break;
        case "关闭":
          window.ipcRenderer.send("close-app", "win");

          break;

        default:
          break;
      }
    },
    generateImage() {
      let position = this.pointList[this.imageIndex].position;
      let rotation = this.pointList[this.imageIndex].rotation;
      this.camera.position.copy(position);
      console.log(this.camera);
      this.camera.rotation.copy(rotation);
      this.renderer.render(this.scene, this.camera);
      window.imageName = "myimage" + this.imageIndex;
      setTimeout(() => {
        this.equi.update(this.camera, this.scene, (data) => {
          this.imageIndex++;
          localStorage.setItem("imageIndex", this.imageIndex);
          console.log(data);
          this.reload();
        });
      }, 600);
    },
  },
};
</script>
<style lang="scss">
@import "../../assets/theme/home.scss";
.myToolBar {
  transition: all 0.4s;
  -webkit-transition: all 0.4s;
  position: absolute;
  right: 50px;
  top: 10px;
  padding: 5px 5px 10px;
  background-color: #fff;
  border-radius: 5px;
  z-index: 3;

  -webkit-app-region: no-drag;
  .el-button {
    border: 1px dashed transparent;
    padding: 0px 10px;
    font-size: 16px;
    border-radius: 4px;
    border-right-color: #ccc;
    position: relative;
  }
  .el-button:last-child {
    border-right: none;
    position: relative;
  }
  .el-button.active {
    color: #3a8ee6;
    outline: 0;
  }
  .el-button i + span {
    font-size: 10px;
    position: absolute;
    bottom: -10px;
    left: 4px;
  }
  .el-button .iconfont + span {
    left: 8px;
  }
}
</style>

