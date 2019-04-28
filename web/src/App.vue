<template>
    <div id="app">
        <div id="nav">
            <div class='logo'>
                <img alt="logo" src="./assets/wh.png">
            </div>
            <div class="contain">
                <router-link class='icon' tag='div' to="/"><img alt="home" src="./assets/search.svg"></router-link>
                <router-link class='icon' tag='div' to="/"><img alt="home" src="./assets/home.svg"></router-link>
                <router-link class='icon' tag='div' to="/about"><img alt="home" src="./assets/chat.svg"></router-link>
                <router-link class='icon' tag='div' to="/logs"><img alt="home" src="./assets/notification.svg"></router-link>
                <!-- <router-link to="/">Home</router-link> |
                <router-link to="/about">About</router-link> -->
                <div class='profile'>
                    <span>Chris Woodle</span>
                    <img src="//www.gravatar.com/avatar/b97b922de69af53b2733aea20c4d601a?d=identicon">
                </div>
            </div>
        </div>
        <div class='container'>
            <router-view />
        </div>

    </div>
</template>

<style lang="scss">
#app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
#nav {
    color: white;
    padding: 30px;
    background: $blue-5;
    position: relative;
    .logo {
        position: absolute;
        top: 0;
        left: 0;
        img {
            padding: 10px;
            height: 40px;
        }
    }
    .contain {
        position: absolute;
        right: 0;
        top: 0;
        line-height: 60px;
        div {
            display: inline-block;
            vertical-align: top;
            padding-left: 15px;
            padding-right: 15px;
            cursor: pointer;
            &:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }
            span {
                vertical-align: top;
                line-height: 60px;
                height: 60px;
                display: inline-block;
            }
            img {
                height: 30px;
                width: 30px;
                margin-left: 10px;
                margin-top: 15px;
                border-radius: 5px;
            }
            &.icon {
                img {
                    height: 16px;
                    width: 16px;
                    margin: 0;
                    margin-top: 22px;
                }
            }
        }
    }
    a {
        color: white;
    }
}

.container {
    max-width: 1000px;
    margin-left: auto;
    margin-right: auto;
    padding-top: 40px;
}
</style>
