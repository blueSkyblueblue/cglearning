class InputTemplate {
  static #s_Count = 0;
  static s_AllProps = [
    "name",
    "radius",
    "base",
    "distance",
    "color",
    "texture",
    "rotationSpeed",
    "revolutionSpeed",
    "light",
    "ring",
    "segments",
  ];
  static s_NeededProps = ["name", "radius", "base", "distance"];
  //   static #s_ValidatorProps = ["name", "base", "radius"];
  #id;
  constructor(name = InputTemplate.#s_Count.toString()) {
    InputTemplate.s_AllProps.forEach(prop => (this[prop] = null));
    this.name = name;
    this.#id = InputTemplate.#s_Count;
    InputTemplate.#s_Count++;
  }

  get id() {
    return this.#id;
  }

  from(info) {
    Object.entries(info).forEach(([key, value]) => (this[key] = value));
    return this;
  }

  isValid() {
    const checker = property => property && property !== "none";
    let result = [this.name, this.base, this.radius].every(checker);
    result =
      result ||
      [this.distance, this.color, this.rotationSpeed, this.revolutionSpeed].every(item =>
        Number.isNaN(item)
      );

    return result;
  }

  generate(useTexture, hasLight, hasRing) {
    const template = {};
    InputTemplate.s_AllProps.forEach(key => (template[key] = this[key]));

    if (useTexture) {
      if (useTexture.planet) template.color = null;

      if (hasRing === false) {
        template.ring = null;
      } else {
        if (useTexture?.ring) template.ring.color = null;
      }
    } else {
      if (template.texture) template.color = null;
      if (template.ring && template.ring.texture) template.ring.color = null;
    }

    if (hasLight === false) template.light = null;

    return template;
  }
}

export default InputTemplate;
