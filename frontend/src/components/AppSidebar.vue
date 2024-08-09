<template>
  <aside>
    <nav>
      <ul>
        <li><router-link to="/account-book/overview">Overview</router-link></li>
        <li><router-link to="/account-book/income">Income</router-link></li>
        <li><router-link to="/account-book/expenses">Expenses</router-link></li>
        <li><router-link to="/account-book/budget">Budget</router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'AppSidebar',
};
</script>

<style scoped>
aside {
  background-color: #333;
  color: white;
  padding: 1rem;
  width: 250px;
  height: 100vh;
  position: fixed;
  left: 0;
}
nav ul {
  list-style: none;
  padding: 0;
}
nav ul li {
  margin-bottom: 1rem;
}
nav ul li a {
  color: white;
  text-decoration: none;
  font-weight: bold;
}
nav ul li a:hover {
  text-decoration: underline;
}
</style>
