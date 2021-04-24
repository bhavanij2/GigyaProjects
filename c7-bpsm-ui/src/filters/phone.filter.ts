const phone = (num: string) => {
  if (num){
    const match = num.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
  }
  return '\u00a0';
};

export default phone;