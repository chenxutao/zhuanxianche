export default {
  supplementZero (num) { // 自动补充 0
    num = Number(num);
    return (num < 10 ? "0" + num : num);
  },
  timeFn (val, format = "YYYY-MM-DD HH:MM:SS", type = "timeStamp") {
    if (type === "timeStamp") {
      let Dates = null;
      format = format || "YYYY-MM-DD HH:MM:SS";
      if (!val) {
        return "无";
      }
      if (val instanceof Object) {
        Dates = new Date(val);
      } else if (Number(val)) {
        val = (val += "").length === 13 ? Number(val) : Number(val) * 1000;
        Dates = new Date(val);
      } else {
        return val;
      }
      let year = Dates.getFullYear(); // 年
      let month = this.supplementZero(Dates.getMonth() + 1); // 月
      let date = this.supplementZero(Dates.getDate()); // 日
      let hour = this.supplementZero(Dates.getHours()); // 时
      let minute = this.supplementZero(Dates.getMinutes()); // 分
      let second = this.supplementZero(Dates.getSeconds()); // 秒
      format = format.toUpperCase();
      format = format.replace(/YYYY/, year);
      format = format.replace(/MM/, month);
      format = format.replace(/DD/, date);
      format = format.replace(/HH/, hour);
      format = format.replace(/MM/, minute);
      format = format.replace(/SS/, second);
      return format;
    }
  }
}
