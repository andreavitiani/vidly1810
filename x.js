//tradeoff between qury performance and persistence

//using references (normalizaion) -> consistency

let author = {
  name: "Andrea"
};

let course = {
  author: "id"
  //   authors: ["id1", "id2", "id3"]
};

//using embedded documents (de-normalization) -> performance

let course2 = {
  author: {
    name: "Andrea"
  }
};

//hybrid approach ask you to embedd a few of the eventually many properties of a file so you are not referencing but at the same time you are not fully embedding
