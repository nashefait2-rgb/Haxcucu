package com.haxvaall.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

public class MainActivity extends Activity {

    WebView web;
    String hxJs = "";

    static final String HIDE_ADS =
        "(function(){"
        + "var st=document.createElement('style');"
        + "st.textContent='.rightbar,[class*=rightbar],[id*=rightbar],[class*=sidebar]{display:none!important}';"
        + "document.head.appendChild(st);"
        + "setInterval(function(){"
        + "var f=document.getElementsByTagName('iframe');"
        + "for(var i=0;i<f.length;i++){"
        + "var s=f[i].src||'';"
        + "if(s&&s.indexOf('haxball')<0){f[i].style.display='none';}"
        + "}"
        + "},1000);"
        + "})();";

    String loadAsset(String name) {
        try {
            InputStream in = getAssets().open(name);
            ByteArrayOutputStream o = new ByteArrayOutputStream();
            byte[] b = new byte[4096];
            int r;
            while ((r = in.read(b)) > 0) o.write(b, 0, r);
            in.close();
            return o.toString("UTF-8");
        } catch (Exception e) {
            return "";
        }
    }

    class Bridge {
        @JavascriptInterface
        public void close() {
            runOnUiThread(new Runnable() {
                @Override public void run() { finish(); }
            });
        }
    }

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_ADJUST_PAN);
        hxJs = loadAsset("hx.js");

        FrameLayout root = new FrameLayout(this);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUserAgentString("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        web.addJavascriptInterface(new Bridge(), "HxApp");
        web.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView v, String url) {
                v.evaluateJavascript(HIDE_ADS, null);
                v.evaluateJavascript(hxJs, null);
            }
        });
        web.loadUrl("https://www.haxball.com/play");
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));
        setContentView(root);
    }

    @Override public void onWindowFocusChanged(boolean f) {
        super.onWindowFocusChanged(f);
        if (f) {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }
}      }
        }, 1000);
    }

    @Override public void onWindowFocusChanged(boolean f) {
        super.onWindowFocusChanged(f);
        if (f) {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
        }
    }
}
