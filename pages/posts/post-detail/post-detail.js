var postsData = require('../../../data/posts-data.js')

Page({
    data: {
        isPlayingMusic: false
    },
    onLoad: function (option) {
        var postId = option.id;
        this.data.currentPostId = postId;
        var postData = postsData.postList[postId];
        this.setData({
            postData: postData
        })
        var postsCollected = wx.getStorageSync('posts_collected')
        if (postsCollected) {
            var postCollected = postsCollected[postId]
            this.setData({
                collected: postCollected
            })
        }
        else {
            var postsCollected = {};
            postsCollected[postId] = false;
            wx.setStorageSync('posts_collected', postsCollected);
        }
    },

    onColletionTap: function (event) {
        // this.getPostsCollectedAsy();
        this.getPostsCollectedSyc();
    },

    //异步
    getPostsCollectedAsy: function () {
        var that = this;
        wx.getStorage({
            key: 'posts_collected',
            success: function (res) {
                var postsCollected = wx.getStorageSync('posts_collected');
                var postCollected = postsCollected[that.data.currentPostId];
                //取反，收藏变成未收藏，未收藏变成收藏
                postCollected = !postCollected;
                postsCollected[that.data.currentPostId] = postCollected;
                that.showToast(postsCollected, postCollected);
            }
        })
    },
    //同步
    getPostsCollectedSyc: function () {
        var postsCollected = wx.getStorageSync('posts_collected');
        var postCollected = postsCollected[this.data.currentPostId];
        //取反，收藏变成未收藏，未收藏变成收藏
        postCollected = !postCollected;
        postsCollected[this.data.currentPostId] = postCollected;
        this.showToast(postsCollected, postCollected);
    },


    showModal: function (postsCollected, postCollected) {
        var that = this;
        wx.showModal({
            title: "收藏",
            content: postCollected ? "收藏该文章?" : "取消收藏?",
            showCancel: "true",
            cancelText: "取消",
            cacelColor: "#333",
            confirmText: "确认",
            confirmColor: "#405f80",
            success: function (res) {
                if (res.confirm) {
                    //更新文章是否的缓存值
                    wx.setStorageSync('posts_collected', postsCollected);
                    //更新数据绑定变量，从而实现切换图片
                    that.setData({
                        collected: postCollected
                    })
                }
            }
        })
    },

    showToast: function (postsCollected, postCollected) {
        //更新文章是否的缓存值
        wx.setStorageSync('posts_collected', postsCollected);
        //更新数据绑定变量，从而实现切换图片
        this.setData({
            collected: postCollected
        })
        wx.showToast({
            title: postCollected ? "收藏成功" : "取消成功",
            duration: 1000,
            icon: "success"
        })
    },

    //分享
    onShareTap: function () {
        var itemList = [
            "分享到朋友圈",
            "分享到微信好友",
            "分享到qq",
            "分享到微博"
        ]
        wx.showActionSheet({
            itemList: itemList,
            itemColor: "405f80",
            success: function (res) {
                wx.showModal({
                    title: "用户" + itemList[res.tapIndex],
                    content: "用户是否取消" + res.cancel + "现在无法实现分享功能。"
                })
            }
        })
    },
    //音乐
    onMusicTap: function (event) {
        var currentPostId = this.data.currentPostId;
        var postData = postsData.postList[currentPostId];
        var isPlayingMusic = this.data.isPlayingMusic;
        if (isPlayingMusic) {
            wx.pauseBackgroundAudio();
            this.setData({
                isPlayingMusic:false
            })
        }
        else{
            wx.playBackgroundAudio({
              dataUrl: postData.music.url,
              title:postData.music.title,
              coverImgUrl:postData.music.coverImgUrl,
            })
            this.setData({
                isPlayingMusic:true
            })
        }
    }



}) 