# 1. lineageos 如何修改系统的时间服务器地址
已测试成功，开发者模式后，连接电脑，输入以下命令，即可wifi正常显示，时间服务器正常工作，使用阿里的时间服务器
```shell
adb shell "settings put global captive_portal_http_url http://connect.rom.miui.com/generate_204"
```
```shell
adb shell "settings put global captive_portal_https_url http://connect.rom.miui.com/generate_204"
```
```shell
adb shell settings put global captive_portal_use_https 0
```
```shell
adb shell settings put global ntp_server ntp1.aliyun.com
```
来源：[lineageos 16 如何修改系统的时间服务器地址](https://www.lineageos.org.cn/forum.php?mod=viewthread&tid=1123&page=1&authorid=9133)
