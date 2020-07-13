// ==UserScript==
// @name         北京市职业技能提升行动管理平台课程自动播放、跳过人脸、自动确定
// @version      0.3.5
// @match        https://www.bjjnts.cn/lessonStudy/*
// @grant        none
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

    var current;
    $('.change_chapter').each((i, o) => {
        if (current) return
        var txt = $(o).find('span').text()
        var mch = /已完成\s*([\d.]+)%/.exec(txt)
        if (mch) console.log(`第${i + 1}节课，进度=${mch[1]}%`)
        if (mch && +mch[1] < 100) {
            current = $(o)
            window.__progress = +mch[1]
        }
    })
    setTimeout(() => {
        if (current) current.click()
        if (!current || !video) console.log('没找到可开始的课程，请手动操作')

        video.onplaying = function () {
            console.log(">>>", video.duration, __progress, video.currentTime)
            if (!video.duration || !__progress || video.currentTime > (video.duration * __progress) / 100 - 5) return
            var newprogress = (video.duration * __progress) / 100 - 1
            console.log("跳到当前课程的进度" + newprogress + " @ " + getCurrentTime());
            video.currentTime = newprogress
        }

        video.onended = function () {
            if (video.currentTime < video.duration) return
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
            if (video.paused) {
                console.log("自动重新播放 @ " + getCurrentTime());
                video.play();
            }
        }, 3000);
    }, 2000)
})();
