<template>
  <ul class="comments-shell">
    <li
      v-for="n in 5"
      class="comments-shell__item">
      <div class="comments-shell__avatar"></div>
      <ul class="comments-shell__content">
        <li class="comments-shell__content-item"></li>
        <li class="comments-shell__content-item"></li>
        <li class="comments-shell__content-item"></li>
      </ul>
    </li>
  </ul>
</template>

<style>
@keyframes shellPulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: .6;
  }
  100% {
    opacity: 1;
  }
}


.comments-shell {
  position: absolute;
  left: 0;
  right: 0;
  .comments-shell__item {
    position: relative;
    display: flex;
    padding: 0 15px;
    margin-bottom: 24px;
  }
  .comments-shell__avatar {
    border-radius: 3px;
    background-color: #F8F8F8;
    display: inline-block;
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    margin-right: 10px;
  }
  .comments-shell__content {
    list-style: none;
    width: 100%;
    .comments-shell__content-item {
      animation: shellPulse 1s infinite;
      background-color: #F8F8F8;
      display: block;
      margin-bottom: 5px;
      height: 13px;
      &:first-child {
        width: 50%;
      }
      &:nth-child(2) {
        width: 40%;
      }
      &:last-child {
        width: 20%;
      }
    }
  }
}
</style>
