const state = {
  dialogVisible: false, // 小窗口显示隐藏
  selectCasementMeth: null,
};
// const getters = {
//   renderOrdersData(state) {
//     //承载变化的ordersData
//     return state.threePoints;
//   }
// };
const mutations = {

  SetDialogVisible(state, obj) {
    state.dialogVisible = obj;
  },
  SetSelectCasementMeth(state, obj) {
    state.selectCasementMeth = obj;
  },
};
const actions = {

  Set_DialogVisible(context, obj) {
    context.commit("SetDialogVisible", obj);
  },
  Set_SelectCasementMeth(context, obj) {
    context.commit("SetSelectCasementMeth", obj);
  },
};
export default {
  namespaced: true, //用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  // getters,
  mutations,
  actions
};
