// ==UserScript==
// @name         北京市职业技能提升行动管理平台课程自动播放、跳过人脸、自动确定
// @version      0.3
// @author       staugur
// @match        https://www.bjjnts.cn/lessonStudy/*
// @grant        none
// @updateURL   https://static.saintic.com/cdn/autoclick.bjjnts.user.js
// ==/UserScript==

(function () {
    'use strict';

    function zeroFill(i) {
        if (i >= 0 && i <= 9) {
            return "0" + i;
        } else {
            return i;
        }
    }

    function getCurrentTime() {
        var date = new Date(); //当前时间
        var month = zeroFill(date.getMonth() + 1); //月
        var day = zeroFill(date.getDate()); //日
        var hour = zeroFill(date.getHours()); //时
        var minute = zeroFill(date.getMinutes()); //分
        var second = zeroFill(date.getSeconds()); //秒

        //当前时间
        var curTime = date.getFullYear() + "-" + month + "-" + day +
            " " + hour + ":" + minute + ":" + second;

        return curTime;
    }

    window.face_monitor = function () {}

    var current, progress;
    $('.change_chapter').each((i, o) => {
        if (current) return
        var txt = $(o).find('span').text()
        var mch = /已完成\s*([\d.]+)%/.exec(txt)
        if (mch) console.log(`第${i + 1}节课，进度=${mch[1]}%`)
        if (mch && +mch[1] < 100) {
            current = $(o)
            progress = +mch[1]
        }
    })
    if (current) current.click()
    if (!current) console.log('没找到可开始的课程，请手动操作')

    var v = window.video || document.getElementById("studymovie")
    if (progress) setTimeout(() => {
        v.currentTime = (v.duration * progress) - 5 // 跳进度
    }, 2000)

    v.onended = function () {
        if (v.currentTime < v.duration) return
        console.log("刷新页面进入下一个课程 @ " + getCurrentTime());
        location.reload()
    }

    setInterval(function () {
        $('.face_recogn').hide();
        var btn = document.querySelector(".layui-layer-dialog .layui-layer-btn .layui-layer-btn0");
        if (btn) {
            btn.click();
            console.log("自动点击按钮 @ " + getCurrentTime());
        }
        if (v.paused) {
            console.log("自动重新播放 @ " + getCurrentTime());
            v.play();
        }
    }, 2000);
})();