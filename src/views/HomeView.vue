<script>
import { RouterLink } from "vue-router";
</script>

<template>
  <div class="header">
    <div class="padding"></div>
    <div class="padding"></div>
    <header>
      <h1>Experiments (Computer Graphics)</h1>
    </header>
    <main>
      <div class="padding"></div>
      <div class="padding"></div>
      <nav>
        <RouterLink to="/three-view">Three View</RouterLink>
        <RouterLink to="/solarsystem">Solar System</RouterLink>
      </nav>
    </main>
  </div>
  <div class="introduction">
    <div class="block">
      <p>
        A multiview drawing usually consists of
        <strong style="color: lightsalmon; font-weight: bold">three views</strong>: a Front view, a
        Top or Bottom view, and a Left or Right view. Although in theory the part could be placed in
        any orientation, the views are usually chosen to coincide with a natural symmetry of the
        part—for example, the front, right, and top of the car shown above. These are called the
        principal views.
      </p>
    </div>
    <div class="block">
      <p>
        The <strong style="color: lightskyblue; font-weight: bold">solar system</strong> consists of
        the Sun and everything that orbits, or travels around, the Sun. This includes the eight
        planets and their moons, dwarf planets, and countless asteroids, comets, and other small,
        icy objects. However, even with all these things, most of the solar system is empty space.
        The solar system itself is only a small part of a huge system of stars and other objects
        called the Milky Way galaxy. The solar system orbits around the center of the galaxy about
        once every 225 million years. The Milky Way galaxy is just one of billions of galaxies that
        in turn make up the universe.
      </p>
    </div>
  </div>
</template>

<style scoped>
.header {
  width: 100%;
  height: 38vh;
  background: linear-gradient(to right bottom, rgb(173, 180, 104), rgb(255, 162, 0));
}

header > h1::before {
  display: inline-block;
  content: "";
  width: 1.5em;
  height: 1.5em;
  vertical-align: -0.3em;
  margin-right: 0.5em;
  background-image: url("@/assets/logos/tetrahedron.ico");
  background-size: cover;
}

.introduction {
  width: 100%;
  height: 62vh;
  padding: 0 7.5%;
  padding-top: 1.5em;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: linear-gradient(to bottom right, rgb(223, 223, 255), rgb(151, 255, 194)),
    url("pictures/bottom-picture.jpeg");
  background-size: cover;
}

.introduction > .block {
  width: 38%;
  height: 95%;
  padding: 1em 2.5em;
  padding-top: 1.5em;
  font-size: 18px;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  font-style: italic;
  text-indent: 2em;
  color: rgb(230, 255, 238);
  border-radius: 5px;
  background-color: rgb(23, 94, 98);
  overflow-y: scroll;
  scrollbar-width: none;
}

.introduction > .block:first-of-type {
  color: rgb(230, 255, 238);
  background-color: rgb(23, 94, 98);
}

.introduction > .block:last-of-type {
  color: rgb(255, 230, 235);
  background-color: rgb(98, 23, 47);
}

.padding {
  height: 2em;
}

header {
  text-align: center;
  font-family: "Courier New ", Courier, monospace;
}

main {
  width: 100%;
}

nav {
  display: flex;
  justify-content: space-around;
  width: 80%;
  margin: auto;
}

nav > a {
  display: block;
  color: aliceblue;
  text-decoration: none;
  font-size: 20px;
  padding: 0.5em 2em;
  border-radius: 2.5px;
  background-color: rgb(89, 184, 97);

  transition-property: transform;
  transition-timing-function: ease-in-out;
  transition-duration: 0.1s;
}

nav > a:hover {
  transform: scale(1.1);
  background-color: color-mix(in srgb, rgb(89, 184, 97) 90%, white);
}

@media (max-height: 750px) {
  .header {
    height: 280px;
  }

  .introduction {
    height: auto;
  }

  .introduction > .block {
    height: 400px;
  }
}

@media (max-width: 850px) and (min-width: 520px) {
  .introduction {
    height: auto;
    flex-direction: column;
    row-gap: 40px;
  }

  .introduction > .block {
    width: 70%;
    height: 400px;
  }
}

@media (max-width: 520px) {
  .padding {
    display: none;
  }

  .padding:first-of-type {
    display: block;
  }

  nav {
    flex-direction: column;
    row-gap: 10px;
  }

  .introduction {
    height: auto;
    flex-direction: column;
    row-gap: 40px;
  }

  .introduction > .block {
    width: 70%;
    height: 400px;
  }
}
</style>
