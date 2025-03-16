package com.tamnd.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true);
        
        // Access the WebView and configure it
        WebView webView = getBridge().getWebView();
        WebSettings settings = webView.getSettings();
        
        // Enable JavaScript and DOM Storage
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        
        // Allow mixed content for development
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        
        // Add console message to WebView
        webView.evaluateJavascript(
            "console.log('WebView initialized successfully');", 
            null
        );
    }
}