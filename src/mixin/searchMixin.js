/* eslint-disable */
import { mapState, mapGetters, mapActions } from "vuex"; //先要引入
// import { Message } from 'element-ui';

export const listSearch = {
  data: function() {
    return {
      Userdata: null,
    };
  },
  computed: {
    ...mapState({
      //这里的...是超引用，ES6的语法，意思是state里有多少属性值用户1可以在这里放多少属性值
      dialogVisible: (state) => state.collection.dialogVisible,
      selectCasementMeth: (state) => state.collection.selectCasementMeth,
      //里面定义的threePoints是指footerStatus.js里state的threePoints
    }),
  },
  methods: {
    ...mapActions("collection", [
      //collection是指modules文件夹下的collection.js
      "Set_DialogVisible",
      "Set_SelectCasementMeth",
    ]),
    addplaneMesh(position) {
      var textureLoader = new THREE.TextureLoader();
      var plane = new THREE.PlaneGeometry(40, 40); // 创建一个矩形几何体
      //标签使用基础网格材质即可
      var planeMaterial = new THREE.MeshBasicMaterial({
        //矩形平面网格模型设置纹理贴图
        map: textureLoader.load("img/sprite.png"),
        // side: THREE.FrontSide, // 默认前面显示，可以不设置
        side: THREE.DoubleSide, // 双面显示
        // side: THREE.BackSide, // 背面显示
        transparent: true, // 开启透明效果，否则颜色贴图map的透明不起作用
      });
      var planeMesh = new THREE.Mesh(plane, planeMaterial);
      planeMesh.rotation.x = -Math.PI / 2;
      position.y += 1;
      planeMesh.position.copy(position);
      return planeMesh;
    },
    setIntersects(event, obj, callback) {
      // const that = this;
      event.preventDefault();
      let clientX = event.clientX || event.touches[0].clientX;
      let clientY = event.clientY || event.touches[0].clientY;
      this.mouse.x =
        (clientX / this.threeDom.getBoundingClientRect().width) * 2 - 1;
      this.mouse.y =
        -(clientY / this.threeDom.getBoundingClientRect().height) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera);

      let intersects = this.raycaster.intersectObjects(obj);
      callback(intersects);
    },
    // 篮球比赛 start
    addControls() {
      const that = this;
      this.controls2 = {
        moveForward: false,
        moveBackward: false,
        moveLeft: false,
        moveRight: false,
      };
      var configOgro = {
        baseUrl: "fbx/",

        body: "ogro.md2",
        // skins: [ "grok.jpg", "ogrobase.png", "arboshak.png", "ctf_r.png", "ctf_b.png", "darkam.png", "freedom.png",
        // 		 "gib.png", "gordogh.png", "igdosh.png", "khorne.png", "nabogro.png",
        // 		 "sharokh.png" ],
        skins: ["grok.jpg"],
        weapons: [["weapon.md2", "weapon.jpg"]],
        animations: {
          move: "run",
          idle: "stand",
          jump: "jump",
          attack: "attack",
          crouchMove: "cwalk",
          crouchIdle: "cstand",
          crouchAttach: "crattack",
        },

        walkSpeed: 350,
        crouchSpeed: 175,
      };
      var nRows = 1;
      var nSkins = configOgro.skins.length;

      this.nCharacters = nSkins * nRows;

      for (var i = 0; i < this.nCharacters; i++) {
        var character = new window.THREE.MD2CharacterComplex();
        character.scale = 3;
        character.controls = this.controls2;
        this.characters.push(character);
      }

      var baseCharacter = new window.THREE.MD2CharacterComplex();
      baseCharacter.scale = 3;

      baseCharacter.onLoadComplete = function() {
        var k = 0;

        for (var j = 0; j < nRows; j++) {
          for (var i = 0; i < nSkins; i++) {
            var cloneCharacter = that.characters[k];

            cloneCharacter.shareParts(baseCharacter);

            // cast and receive shadows
            cloneCharacter.enableShadows(true);

            cloneCharacter.setWeapon(0);
            cloneCharacter.setSkin(i);

            cloneCharacter.root.position.x = 900 + (i - nSkins / 2) * 150;
            cloneCharacter.root.position.z = -600 + j * 250;
            cloneCharacter.root.position.y = 60;
            that.controls.target.set(900, 60, -600);
            that.controls.update();
            that.camera.position.set(400, 120, -300);
            console.log(cloneCharacter.root);
            // cloneCharacter.root.children[1].scale.set(0.1, 0.1, 0.1);
            that.scene.add(cloneCharacter.root);

            k++;
          }
        }

        var gyro = new window.THREE.Gyroscope();
        gyro.add(that.camera);
        // gyro.add(that.dirLight, that.dirLight.target);

        that.characters[Math.floor(nSkins / 2)].root.add(gyro);
      };

      baseCharacter.loadParts(configOgro);
      document.addEventListener("keydown", this.onKeyDown, false);
      document.addEventListener("keyup", this.onKeyUp, false);
    },
    onKeyDown(event) {
      event.stopPropagation();

      switch (event.keyCode) {
        case 38: /*up*/
        case 87:
          /*W*/ this.controls2.moveForward = true;
          break;

        case 40: /*down*/
        case 83:
          /*S*/ this.controls2.moveBackward = true;
          break;

        case 37: /*left*/
        case 65:
          /*A*/ this.controls2.moveLeft = true;
          break;

        case 39: /*right*/
        case 68:
          /*D*/ this.controls2.moveRight = true;
          break;

        case 67:
          /*C*/ this.controls2.crouch = true;
          break;
        case 32:
          /*space*/ this.controls2.jump = true;
          break;
        case 17:
          /*ctrl*/ this.controls2.attack = true;
          break;
      }
    },
    onKeyUp(event) {
      event.stopPropagation();

      switch (event.keyCode) {
        case 38: /*up*/
        case 87:
          /*W*/ this.controls2.moveForward = false;
          break;

        case 40: /*down*/
        case 83:
          /*S*/ this.controls2.moveBackward = false;
          break;

        case 37: /*left*/
        case 65:
          /*A*/ this.controls2.moveLeft = false;
          break;

        case 39: /*right*/
        case 68:
          /*D*/ this.controls2.moveRight = false;
          break;

        case 67:
          /*C*/ this.controls2.crouch = false;
          break;
        case 32:
          /*space*/ this.controls2.jump = false;
          break;
        case 17:
          /*ctrl*/ this.controls2.attack = false;
          break;
      }
    },
    // 篮球比赛 --end
  },

  // created() {
  //   this.getUserdata()
  // }
};
