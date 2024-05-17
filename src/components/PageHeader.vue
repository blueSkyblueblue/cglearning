<template>
  <header>
    <nav><RouterLink to="/">Home</RouterLink></nav>
    <h1 id="title"><slot></slot></h1>
  </header>
</template>

<style scoped>
header {
  height: 45px;
  background-color: rgb(55, 167, 55);
  display: flex;
  margin-bottom: 2em;
}

header nav {
  flex: initial;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5em;
  background-color: rgb(74, 173, 177);
}

nav a {
  color: rgb(32, 62, 137);
  font-weight: bolder;
  font-size: larger;
  font-family: Verdana, sans-serif;
  text-decoration: none;
  transition: transform 0.1s ease-in-out, color 0.2s ease-in-out;
}

nav a:hover {
  color: rgb(202, 42, 42);
  text-transform: uppercase;
  transform: rotate(-5deg);
}

#title {
  flex: auto;
  font-size: 20px;
  color: rgb(51, 47, 47);
  text-align: center;
  font-family: "Trebuchet MS", "Lucida Sans Unicode", "Lucida Grande", "Lucida Sans", Arial,
    sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
