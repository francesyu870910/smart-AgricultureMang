package com.greenhouse.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * 首页控制器
 * 处理根路径访问，重定向到前端页面
 */
@Controller
public class IndexController {

    /**
     * 根路径重定向到登录页面
     */
    @GetMapping("/")
    public String index() {
        return "redirect:/login.html";
    }

    /**
     * 首页重定向到系统主页
     */
    @GetMapping("/index")
    public String home() {
        return "redirect:/frontend/index.html";
    }

    /**
     * 仪表板重定向
     */
    @GetMapping("/dashboard")
    public String dashboard() {
        return "redirect:/dashboard.html";
    }
}