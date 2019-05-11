import Vue from "vue";
import utils from "../utils";
//时间格式化

Vue.filter("time", utils.timeFn);
