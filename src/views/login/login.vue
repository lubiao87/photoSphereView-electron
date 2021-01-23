<template>
  <div class="page-login">
    <headers :pageName="'win'"/>
    <div class="yhui-imglogo">
      <img
        style="width: 70px; float: left; margin-right: 5px"
        src="../../assets/common/image/okay_logo.png"
        alt=""
      />
      <!-- 白云数据采集<br /> -->
    </div>

    <div class="login_box">
      <div class="login_header">
        <h3 class="logo outlinedA fn-pl20 float_L">login</h3>
      </div>
      <div class="user_name">
        <i
          class="el-icon-s-custom"
          v-bind:class="{ writeColor2: chagecolor, activeColorb: !chagecolor }"
        ></i>
        <input
          class="aa"
          type="text"
          v-model="user.username"
          name="username"
          placeholder="用户名"
          v-on:focus="chagecolor = false"
          v-on:blur="chagecolor = true"
        />
      </div>
      <div class="pass_word">
        <i
          class="el-icon-lock"
          v-bind:class="{
            writeColor2: chagecolorpass,
            activeColorb: !chagecolorpass,
          }"
        ></i>
        <input
          type="password"
          v-model="user.password"
          name="password"
          placeholder="密码"
          v-on:focus="chagecolorpass = false"
          v-on:blur="chagecolorpass = true"
        />
      </div>

          <el-checkbox class="rember-checkbox" v-model="RemberPass">记住我</el-checkbox>
      <div class="confirm_button">
        <button
          type="button"
          class="btn_main_cs"
          v-bind:disabled="isDisabled"
          @click="tologin()"
        >
          {{ loginName }}
        </button>
      </div>
    </div>
    <div id="particles_js"></div>
    <div class="foot">
      当前: {{ version }} 最新: {{ versionText }}
      <el-button
        class="autoBtn"
        type="text"
        size="mini"
        @click.native="autoUpdate"
        >获取更新</el-button
      >
    </div>
  </div>
</template>

<script>
import packages from "../../../package.json";
import particlesJS from "../../assets/particles";
import headers from "@/components/header";
import { getMapConfigLocal } from "../../api/api"; //api配置请求的路径
import fs from "fs";
const { resolve } = require("path");

export default {
  name: "loginPage",
  components: {
    headers,
  },
  data() {
    return {
      isDisabled: false,
      loginName: "登录",
      codeAutofocus: false,
      chagecolor: true,
      chagecolorpass: true,
      chagecolorcode: true,
      user: {
        username: "",
        password: "",
      },
      version: "",
      versionText: "正在获取版本...",
      RemberPass: false
    };
  },
  created() {
   
    let config = fs.readFileSync(resolve("./") + "\\config.json", "utf-8");
     config = JSON.parse(config);
    if(config.userName) {
      this.RemberPass = true;
      this.user.username = config.userName;
      this.user.password = config.userPassword;
    } else {
      this.RemberPass = false;
    }
  },
  mounted() {
    const that = this;
    this.initBackground();
    // const {resolve} = require('path')
    // var packages = fs.readFileSync(resolve('./') + "\\package.json", "utf-8");
    // packages = JSON.parse(packages);
    // console.log(packages);
    this.version = packages.version;
    document.body.onresize = this.initBackground;
    document.onkeyup = (event) => {
      // console.log(event.keyCode, this.$route.name);
      if (event.keyCode === 13 && this.$route.name === "login") {
        this.tologin();
      }
    };
    if (window.ipcRenderer) {
      window.ipcRenderer.on("message", (event, { message, data }) => {
        console.log(message, data);
        if (data && data.version) {
          that.versionText = data.version;
        }
        if (message === "isUpdateNow") {
          if (confirm("是否现在更新？")) {
            window.ipcRenderer.send("updateNow", "立即更新");
          }
        } else {
          if (that.parems) {
            console.log(that.parems);
            that.parems.success(data);
          }
        }
      });
    }

    this.autoUpdate();
  },
  methods: {
    async tologin() {
      // const that = this;
      this.isDisabled = true;
      this.loginName = "登录中...";
      if (
        this.user.username == null ||
        this.user.username == "" ||
        this.user.password == null ||
        this.user.password == ""
      ) {
        this.$message.error("账号或者密码不能为空！");
        // this.createCode();
        this.isDisabled = false;
        this.loginName = "登录";
        return;
      }

      let data = {
        XP_USERCODE: this.user.username,
        XP_PASSWORD: this.user.password,
        // XP_LOGCOMID: Math.ceil(Math.random()*10000),
        XP_LOGCOMID: 60216,
      };
      getMapConfigLocal(data).then((rs) => {
        console.log(rs);
        if (rs && rs.XP_TOKEN) {
          let config = fs.readFileSync(resolve("./") + "\\config.json", "utf-8");
           config = JSON.parse(config);
          if(this.RemberPass) {
            config.userName = this.user.username;
            config.userPassword = this.user.password;
            fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
          } else {
            config.userName = "";
            config.userPassword = "";
            fs.writeFileSync("config.json", JSON.stringify(config, null, 2));
          }
          localStorage.setItem("loginData", JSON.stringify(rs));
          this.$router.push({ path: "/home" });
        } else {
          this.$message.error(rs.XP_MSG);
        }
        this.isDisabled = false;
        this.loginName = "登录";
      })
      console.log("登录");
    },
    initBackground() {
      console.log("23");
      document.getElementById("particles_js").innerHTML = "";
      particlesJS("particles_js", {
        particles: {
          color: "#fff",
          shape: "circle", // "circle", "edge" or "triangle"
          opacity: 0.1,
          size: 1,
          size_random: true,
          nb: 150, //150,
          line_linked: {
            enable_auto: true,
            distance: 100,
            color: "#fff",
            opacity: 1,
            width: 1,
            condensed_mode: {
              enable: false,
              rotateX: 600,
              rotateY: 600,
            },
          },
          anim: {
            enable: true,
            speed: 1,
          },
        },
        interactivity: {
          enable: true,
          mouse: {
            distance: 300,
          },
          detect_on: "canvas", // "canvas" or "window"
          mode: "grab",
          line_linked: {
            opacity: 0.5,
          },
          events: {
            onclick: {
              enable: true,
              mode: "push", // "push" or "remove"
              nb: 4,
            },
          },
        },
        retina_detect: true,
      });
    },
    autoUpdate() {
      // console.log("update");
      window.ipcRenderer.send("update", "更新...");
    },
  },
};
</script>
<style lang="scss" scoped>
/* 登录页面开始 */
@import "../../assets/theme/login.css";
@import "../../assets/theme/font-style.css";
.logo {
  font-size: 16px;
  height: 100%;
  // line-height: 54px;
  font-family: "YouYuan";
  width: 100%;
  padding-left: 0;
}
#particles_js {
  width: 100%;
  height: 100%;
  background:#2ba353;
}
.foot {
  width: 300px;
  height: 30px;
  line-height: 30px;
  margin-left: -150px;
  position: absolute;
  bottom: 10px;
  left: 50%;
  font-size: 10px;
  .autoBtn {
    margin-left: 10px;
  }
  span {
    font-size: 10px;
  }
}
.cd-index-line-container{
	margin-top: 15px;
	padding:10px 5px;
}
.cd-index-line-container label,.cd-index-line-container span,.cd-index-line-container p{
	font-size: 12px;
	color: #b8b7b7;
}
.cd-index-line-container a{
	float: right;
	font-size: 12px;
	color: #888888;
	cursor: pointer;
	line-height: 22px;
}
.rember-checkbox {
    float: left;
    margin-left: 20px;
    margin-bottom: 10px;
    font-size: 10px;
}
</style>
<style>
 .rember-checkbox .el-checkbox__label {
   font-size: 10px;
 }
</style>