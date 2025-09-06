let hamster = {
  stomach: [],

  eat(food) {
    this.stomach.push(food);
  }
};

let speedy = {
  __proto__: hamster
};

let lazy = {
  __proto__: hamster
};

speedy.eat("apple");
alert( speedy.stomach ); // speedy now has a new property which is stomach array.
alert( lazy.stomach ); // this has [] sincei t references the hamster stomach. so its empty.