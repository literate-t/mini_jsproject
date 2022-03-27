(function () {
  "use strict";

  const get = (target) => {
    return document.querySelector(target);
  };

  const getAll = (target) => {
    return document.querySelectorAll(target);
  };

  const createEl = (target) => {
    return document.createElement(target);
  };

  const $loader = get(".loader");

  let page = 1;
  const $posts = get(".posts");
  const limit = 10;
  const end = 100;
  let totalPostCount = 10;

  const getPost = async () => {
    const API_URL = `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`;
    const res = await fetch(API_URL);
    if (!res.ok) {
      throw new Error("error occured");
    }

    return await res.json();
  };

  const showPost = (posts) => {
    posts.forEach((post) => {
      const $post = createEl("div");
      $post.classList.add("post");
      $post.innerHTML = `
        <div class="header">
          <div class="id">${post.id}</div>
          <div class="title">${post.title}</div>
        </div>
        <div class="body">
          ${post.body}
        </div>
      `;
      $posts.appendChild($post);
    });
  };

  const showLoader = () => {
    $loader.classList.add("show");
  };

  const hideLoader = () => {
    $loader.classList.remove("show");
  };

  const loadPost = async () => {
    showLoader();
    try {
      const res = await getPost();
      showPost(res);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - 5 <= scrollTop + clientHeight) {
      if (end <= totalPostCount) {
        window.removeEventListener("scroll", onScroll);
        return;
      }
      ++page;
      totalPostCount += 10;
      loadPost();
    }
  };

  window.addEventListener("DOMContentLoaded", () => {
    loadPost();
    window.addEventListener("scroll", onScroll);
  });
})();
