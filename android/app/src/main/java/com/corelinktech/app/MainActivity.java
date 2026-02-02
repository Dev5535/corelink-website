package com.corelinktech.app;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.Bridge;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.Gravity;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;
import android.graphics.BitmapFactory;
import android.graphics.drawable.BitmapDrawable;
import android.content.res.AssetManager;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends BridgeActivity {
  @Override
  public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    final Bridge bridge = this.getBridge();
    final WebView webView = bridge.getWebView();
    final FrameLayout splashOverlay = new FrameLayout(this);
    final FrameLayout zoomResetContainer = new FrameLayout(this);

    if (webView != null) {
      webView.getSettings().setJavaScriptEnabled(true);
      webView.getSettings().setDomStorageEnabled(true);
      webView.getSettings().setSupportZoom(true);
      webView.getSettings().setBuiltInZoomControls(true);
      webView.getSettings().setDisplayZoomControls(false);
      webView.getSettings().setLoadWithOverviewMode(true);
      webView.getSettings().setUseWideViewPort(true);

      try {
        // Build splash overlay using existing web assets (no new native resources required)
        AssetManager am = getAssets();
        // Paths inside android_asset/public because Capacitor copies /public into /dist and then into /android_asset/public
        BitmapDrawable nebulaBg = new BitmapDrawable(getResources(),
          BitmapFactory.decodeStream(am.open("public/assets/background.png")));
        BitmapDrawable angelLogo = new BitmapDrawable(getResources(),
          BitmapFactory.decodeStream(am.open("public/assets/neon_angel_logo_v1.png")));

        ImageView bgView = new ImageView(this);
        bgView.setImageDrawable(nebulaBg);
        bgView.setScaleType(ImageView.ScaleType.CENTER_CROP);
        bgView.setLayoutParams(new FrameLayout.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        ));

        ImageView logoView = new ImageView(this);
        logoView.setImageDrawable(angelLogo);
        logoView.setScaleType(ImageView.ScaleType.FIT_CENTER);
        FrameLayout.LayoutParams lp = new FrameLayout.LayoutParams(
          ViewGroup.LayoutParams.WRAP_CONTENT,
          ViewGroup.LayoutParams.WRAP_CONTENT
        );
        lp.gravity = Gravity.CENTER;
        logoView.setLayoutParams(lp);

        splashOverlay.addView(bgView);
        splashOverlay.addView(logoView);

        addContentView(splashOverlay, new FrameLayout.LayoutParams(
          ViewGroup.LayoutParams.MATCH_PARENT,
          ViewGroup.LayoutParams.MATCH_PARENT
        ));
      } catch (Exception ignored) {}
      FrameLayout.LayoutParams resetLp = new FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.WRAP_CONTENT,
        ViewGroup.LayoutParams.WRAP_CONTENT
      );
      resetLp.gravity = Gravity.BOTTOM | Gravity.END;
      int m = (int) (16 * getResources().getDisplayMetrics().density);
      resetLp.setMargins(m, m, m, m);
      android.widget.Button resetBtn = new android.widget.Button(this);
      resetBtn.setText("Reset");
      resetBtn.setAlpha(0.8f);
      resetBtn.setPadding(m, m, m, m);
      resetBtn.setVisibility(View.GONE);
      resetBtn.setOnClickListener(v -> {
        float scale = webView.getScale();
        if (scale != 0f) {
          webView.zoomBy(1.0f / scale);
        }
        v.setVisibility(View.GONE);
      });
      zoomResetContainer.addView(resetBtn, resetLp);
      addContentView(zoomResetContainer, new FrameLayout.LayoutParams(
        ViewGroup.LayoutParams.MATCH_PARENT,
        ViewGroup.LayoutParams.MATCH_PARENT
      ));

      webView.setWebViewClient(new WebViewClient() {
        private boolean isInternal(Uri uri) {
          final String host = uri.getHost();
          return host != null && (host.equals("corelinkautomation.com") || host.equals("www.corelinkautomation.com"));
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
          final Uri uri = request.getUrl();
          if (isInternal(uri)) {
            return false;
          }
          Intent intent = new Intent(Intent.ACTION_VIEW, uri);
          view.getContext().startActivity(intent);
          return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
          if (splashOverlay != null) {
            splashOverlay.setVisibility(View.GONE);
          }
          super.onPageFinished(view, url);
        }

        @Override
        public void onScaleChanged(WebView view, float oldScale, float newScale) {
          if (zoomResetContainer.getChildCount() > 0) {
            View btn = zoomResetContainer.getChildAt(0);
            if (Math.abs(newScale - 1.0f) > 0.02f) {
              btn.setVisibility(View.VISIBLE);
            } else {
              btn.setVisibility(View.GONE);
            }
          }
          super.onScaleChanged(view, oldScale, newScale);
        }

        @Override
        public void onReceivedError(WebView view, int errorCode, String description, String failingUrl) {
          showErrorDialog();
        }

        @Override
        public void onReceivedHttpError(WebView view, android.webkit.WebResourceRequest request, android.webkit.WebResourceResponse errorResponse) {
          showErrorDialog();
        }

        private void showErrorDialog() {
          new AlertDialog.Builder(MainActivity.this)
            .setTitle("Default Error Message")
            .setMessage("Well… that wasn’t supposed to happen\n\nOur systems tripped over a cable. Uh oh :(")
            .setPositiveButton("OK", null)
            .show();
        }
      });
    }
  }

  @Override
  public void onBackPressed() {
    WebView webView = this.getBridge().getWebView();
    if (webView != null && webView.canGoBack()) {
      // If we are at the homepage, confirm exit
      String currentUrl = webView.getUrl();
      if (currentUrl != null && (currentUrl.equals("https://corelinkautomation.com/") || currentUrl.equals("https://corelinkautomation.com"))) {
        new AlertDialog.Builder(MainActivity.this)
          .setTitle("Whoa there")
          .setMessage("You’re about to leave CoreLink Tech. Everything still works if you stay… just saying.")
          .setNegativeButton("Let me Be a Baby and leave.", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
              MainActivity.super.onBackPressed();
            }
          })
          .setPositiveButton("Stay and be part of the Tech army", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
              dialog.dismiss();
            }
          })
          .show();
      } else {
        webView.goBack();
      }
    } else {
      super.onBackPressed();
    }
  }
}
