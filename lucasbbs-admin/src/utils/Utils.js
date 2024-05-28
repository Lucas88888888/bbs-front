export default {
  sizeToStr: (size) => {
    let data = "";
    if (size < 0.1 * 1024) {
      data = size.toFixed(2) + "B";
    } else if (size < 0.1 * 1024 * 1024) {
      data = (size / 1024).toFixed(2) + "KB";
    } else if (size < 0.1 * 1024 * 1024 * 1024) {
      data = (size / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      data = (size / (1024 * 1024 * 1024)).toFixed(2) + "GB";
    }

    let sizestr = data + "";
    let len = sizestr.indexOf(".");
    let dec = sizestr.substring(len + 1, len + 3);
    if (dec === "00") {
      return (
        sizestr.substring(0, len) + sizestr.sizestr.substring(len + 3, len + 5)
      );
    }
    return sizestr;
  },
};
