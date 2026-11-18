package com.haxvaall.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.Gravity;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {

    WebView web;
    Stick stick;
    Kick kick;
    final Handler h = new Handler(Looper.getMainLooper());
    final boolean[] dirs = new boolean[4];
    final String[] names = {"ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"};
    final int[] kcs = {37, 39, 38, 40};

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

    static final String CHECK =
        "(function(){function f(d){"
        + "var c=d.getElementsByTagName('canvas');"
        + "for(var i=0;i<c.length;i++){if(c[i].offsetWidth>100&&c[i].offsetHeight>100)return true;}"
        + "var fr=d.getElementsByTagName('iframe');"
        + "for(var j=0;j<fr.length;j++){try{if(fr[j].contentDocument&&f(fr[j].contentDocument))return true;}catch(e){}}"
        + "return false;}"
        + "return f(document);})()";

    void key(String k, String c, int kc, boolean down) {
        String js = "(function(){var t='" + (down ? "keydown" : "keyup") + "';var ds=[];"
            + "function col(d){ds.push(d);var f=d.getElementsByTagName('iframe');"
            + "for(var i=0;i<f.length;i++){try{if(f[i].contentDocument)col(f[i].contentDocument);}catch(e){}}}"
            + "col(document);"
            + "ds.forEach(function(d){var o=d.body||d.documentElement;"
            + "var ev=new KeyboardEvent(t,{key:'" + k + "',code:'" + c + "',keyCode:" + kc + ",which:" + kc
            + ",bubbles:true,cancelable:true});o.dispatchEvent(ev);});})();";
        web.evaluateJavascript(js, null);
    }

    void dirKey(int i, boolean down) {
        key(names[i], names[i], kcs[i], down);
    }

    void setControls(boolean in) {
        int v = in ? View.VISIBLE : View.GONE;
        if (stick.getVisibility() != v) {
            if (!in) {
                for (int i = 0; i < 4; i++) {
                    if (dirs[i]) { dirs[i] = false; dirKey(i, false); }
                }
            }
            stick.setVisibility(v);
            kick.setVisibility(v);
        }
    }

    class Stick extends View {
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        float tx, ty;
        boolean active;

        Stick(Context c) { super(c); }

        @Override protected void onDraw(Canvas c) {
            float cx = getWidth() / 2f, cy = getHeight() / 2f, r = getWidth() / 2f;
            p.setColor(0x33FFFFFF);
            c.drawCircle(cx, cy, r, p);
            p.setColor(0x88FFFFFF);
            c.drawCircle(active ? tx : cx, active ? ty : cy, r / 3f, p);
        }

        @Override public boolean onTouchEvent(MotionEvent e) {
            float cx = getWidth() / 2f, cy = getHeight() / 2f, r = getWidth() / 2f;
            int a = e.getActionMasked();
            boolean[] n = new boolean[4];
            if (a == MotionEvent.ACTION_UP || a == MotionEvent.ACTION_CANCEL) {
                active = false;
            } else {
                float dx = e.getX() - cx, dy = e.getY() - cy;
                float d = (float) Math.hypot(dx, dy);
                if (d > r) { dx = dx * r / d; dy = dy * r / d; }
                tx = cx + dx; ty = cy + dy; active = true;
                float th = r * 0.3f;
                n[0] = dx < -th; n[1] = dx > th;
                n[2] = dy < -th; n[3] = dy > th;
            }
            for (int i = 0; i < 4; i++) {
                if (n[i] != dirs[i]) { dirs[i] = n[i]; dirKey(i, n[i]); }
            }
            invalidate();
            return true;
        }
    }

    class Kick extends View {
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        boolean down;

        Kick(Context c) { super(c); }

        @Override protected void onDraw(Canvas c) {
            float r = getWidth() / 2f;
            p.setColor(down ? 0x99FFA040 : 0x55FFA040);
            c.drawCircle(r, r, r, p);
        }

        @Override public boolean onTouchEvent(MotionEvent e) {
            int a = e.getActionMasked();
            if (a == MotionEvent.ACTION_DOWN && !down) {
                down = true; key("x", "KeyX", 88, true);
            } else if (a == MotionEvent.ACTION_UP || a == MotionEvent.ACTION_CANCEL) {
                down = false; key("x", "KeyX", 88, false);
            }
            invalidate();
            return true;
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override protected void onCreate(Bundle b) {
        super.onCreate(b);
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        FrameLayout root = new FrameLayout(this);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setUseWideViewPort(true);
        s.setLoadWithOverviewMode(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setUserAgentString("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        web.setWebViewClient(new WebViewClient() {
            @Override public void onPageFinished(WebView v, String url) {
                v.evaluateJavascript(HIDE_ADS, null);
            }
        });
        web.loadUrl("https://www.haxball.com/play");
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));

        float d = getResources().getDisplayMetrics().density;

        int ss = (int) (150 * d);
        FrameLayout.LayoutParams l1 = new FrameLayout.LayoutParams(
            ss, ss, Gravity.BOTTOM | Gravity.LEFT);
        l1.setMargins((int) (30 * d), 0, 0, (int) (30 * d));
        stick = new Stick(this);
        stick.setVisibility(View.GONE);
        root.addView(stick, l1);

        int ks = (int) (90 * d);
        FrameLayout.LayoutParams l2 = new FrameLayout.LayoutParams(
            ks, ks, Gravity.BOTTOM | Gravity.RIGHT);
        l2.setMargins(0, 0, (int) (40 * d), (int) (40 * d));
        kick = new Kick(this);
        kick.setVisibility(View.GONE);
        root.addView(kick, l2);

        setContentView(root);

        h.postDelayed(new Runnable() {
            @Override public void run() {
                web.evaluateJavascript(CHECK, new ValueCallback<String>() {
                    @Override public void onReceiveValue(String v) {
                        setControls("true".equals(v));
                    }
                });
                h.postDelayed(this, 1000);
            }
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
