function getTextColor(hexcolor: string) {
  if (hexcolor)
    return parseInt(hexcolor.replace("#", ""), 16) > 0xffffff / 2
      ? "black"
      : "white";
  return "inherit";
}

export { getTextColor };
