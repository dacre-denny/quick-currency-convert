package com.quickcurrencyconvert;

import android.hardware.Camera;
import android.util.Log;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.image.ReactImageView;

/**
 * Created by Dacre on 10/06/2017.
 */

public class OCRPreviewManager extends SimpleViewManager<RelativeLayout> {

    public static final String REACT_CLASS = "OCRView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    Camera _camera;
    SurfaceHolder _surfaceHolder;

    @SuppressWarnings("deprecation")
    @Override
    protected RelativeLayout createViewInstance(ThemedReactContext reactContext) {


        final RelativeLayout container = new RelativeLayout(reactContext);
        TextView textView = new TextView(reactContext);
        textView.setText("hello world888");
        RelativeLayout.LayoutParams lp = new RelativeLayout.LayoutParams(960, 150);
        container.addView(textView, lp);

        SurfaceView surfaceView = new SurfaceView(reactContext);
        SurfaceHolder surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder surfaceHolder) {

                try {

                    Camera camera = Camera.open(Camera.CameraInfo.CAMERA_FACING_BACK);
                    Camera.Parameters parameters = camera.getParameters();

                    Camera.Size previewSize = parameters.getSupportedPreviewSizes().get(0);

                    parameters.setPreviewSize(previewSize.width, previewSize.height);

                    camera.setParameters(parameters);
                    camera.setPreviewDisplay(surfaceHolder);
                    camera.startPreview();
                    _camera = camera;
                }
                catch (Exception e) {

                    Log.e("aquire camera", e.getMessage());
                }
            }

            @Override
            public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {

                try {

                    if(_camera != null) {
                        _camera.stopPreview();

                        _camera.setPreviewDisplay(surfaceHolder);
                        _camera.startPreview();
                    }
                }
                catch (Exception exception) {

                }
            }

            @Override
            public void surfaceDestroyed(SurfaceHolder surfaceHolder) {

                if(_camera != null) {
                    _camera.stopPreview();
                    _camera.release();
                    _camera = null;
                }
            }
        });
        container.addView(surfaceView);

        _surfaceHolder = surfaceHolder;

        return container;

      //  return new OCRView(reactContext);
    }


    @ReactProp(name = "borderRadius", defaultFloat = 0f)
    public void setBorderRadius(ReactImageView view, float borderRadius) {

    }
/*
    @ReactProp(name = "onPrice")
    public void setOnPrice(ReactImageView view, Callback callback) {

       // callback.invoke(0);
    }
    */
}
