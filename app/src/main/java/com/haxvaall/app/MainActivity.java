package com.haxvaall.app;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.os.Bundle;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

public class MainActivity extends Activity {

    WebView web;
    final boolean[] dirs = new boolean[4];
    final int[] codes = {
        KeyEvent.KEYCODE_DPAD_LEFT, KeyEvent.KEYCODE_DPAD_RIGHT,
        KeyEvent.KEYCODE_DPAD_UP, KeyEvent.KEYCODE_DPAD_DOWN
    };

    void key(int code, boolean down) {
        long t = System.currentTimeMillis();
        web.dispatchKeyEvent(new KeyEvent(t, t,
            down ? KeyEvent.ACTION_DOWN : KeyEvent.ACTION_UP, code, 0));
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
                if (n[i] != dirs[i]) { dirs[i] = n[i]; key(codes[i], n[i]); }
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
                down = true; key(KeyEvent.KEYCODE_X, true);
            } else if (a == MotionEvent.ACTION_UP || a == MotionEvent.ACTION_CANCEL) {
                down = false; key(KeyEvent.KEYCODE_X, false);
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
        web.setWebViewClient(new WebViewClient());
        web.loadUrl("https://www.haxball.com/play");
        root.addView(web, new FrameLayout.LayoutParams(-1, -1));

        float d = getResources().getDisplayMetrics().density;

        int ss = (int) (150 * d);
        FrameLayout.LayoutParams l1 = new FrameLayout.LayoutParams(
            ss, ss, Gravity.BOTTOM | Gravity.LEFT);
        l1.setMargins((int) (30 * d), 0, 0, (int) (30 * d));
        root.addView(new Stick(this), l1);

        int ks = (int) (90 * d);
        FrameLayout.LayoutParams l2 = new FrameLayout.LayoutParams(
            ks, ks, Gravity.BOTTOM | Gravity.RIGHT);
        l2.setMargins(0, 0, (int) (40 * d), (int) (40 * d));
        root.addView(new Kick(this), l2);

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
}
