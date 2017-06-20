package com.quickcurrencyconvert;

import android.hardware.Camera;
import android.support.annotation.Nullable;
import android.util.Log;
import android.util.SparseArray;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import android.widget.RelativeLayout;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.google.android.gms.vision.Detector;
import com.google.android.gms.vision.text.TextBlock;
import com.google.android.gms.vision.text.TextRecognizer;

import java.util.Map;

/**
 * Created by Dacre on 10/06/2017.
 */
class OcrDetectorProcessor implements Detector.Processor<TextBlock> {

    Callback mCallback;

    public void setmCallback(Callback mCallback) {
        this.mCallback = mCallback;
    }

    @Override
    public void release() {

        return;
    }

    @Override
    public void receiveDetections(Detector.Detections<TextBlock> detections) {

        SparseArray<TextBlock> items = detections.getDetectedItems();
        for(int i = 0; i < items.size(); i++) {

            TextBlock item = items.valueAt(i);

            if(mCallback != null) {
                mCallback.invoke(item.getValue());
            }
            //Toast.makeText(mContext, item.getValue(), Toast.LENGTH_SHORT).show();
        }
        return;
    }
}

public class OCRPreviewManager extends SimpleViewManager<RelativeLayout> {

    public static final String REACT_CLASS = "OCRView";

    @Override
    public String getName() {
        return REACT_CLASS;
    }

    CameraSource mCameraSource;
    OcrDetectorProcessor mOcrDetectorProcessor;

@Nullable
@Override
public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
            .put("onTextDetected",
                    MapBuilder.of("registrationName", "onTextDetected"))
            .build();
}


    @SuppressWarnings("deprecation")
    @Override
    protected RelativeLayout createViewInstance(ThemedReactContext reactContext) {



        boolean useFlash = false;
        boolean autoFocus = true;
final ThemedReactContext fReactContext = reactContext;

        mOcrDetectorProcessor = new OcrDetectorProcessor();


        TextRecognizer textRecognizer = new TextRecognizer.Builder(reactContext).build();
        textRecognizer.setProcessor(mOcrDetectorProcessor);

        // TODO: Check if the TextRecognizer is operational.
        if (!textRecognizer.isOperational()) {


            // Check for low storage.  If there is low storage, the native library will not be
            // downloaded, so detection will not become operational.
            //IntentFilter lowstorageFilter = new IntentFilter(Intent.ACTION_DEVICE_STORAGE_LOW);
//            boolean hasLowStorage = registerReceiver(null, lowstorageFilter) != null;
//
//            if (hasLowStorage) {
//                Toast.makeText(this, R.string.low_storage_error, Toast.LENGTH_LONG).show();
//                Log.w(TAG, getString(R.string.low_storage_error));
//            }
        }

        mCameraSource =
                new CameraSource.Builder(reactContext, textRecognizer)
                        .setFacing(CameraSource.CAMERA_FACING_BACK)
                        .setRequestedPreviewSize(1280, 1024)
                        .setRequestedFps(25.0f)
                        .setFlashMode(useFlash ? Camera.Parameters.FLASH_MODE_TORCH : null)
                        .setFocusMode(autoFocus ? Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE : null)
                        .build();



        final RelativeLayout container = new RelativeLayout(reactContext);

        if(mOcrDetectorProcessor != null) {

            mOcrDetectorProcessor.setmCallback(new Callback() {
                @Override
                public void invoke(Object... args) {

                    WritableArray array = Arguments.createArray();
                    for(Object arg : args) {
                        array.pushString(String.valueOf(arg));
                    }

                    WritableMap event = Arguments.createMap();
                    event.putArray("matches", array);

                    fReactContext.getJSModule(RCTEventEmitter.class).receiveEvent(container.getId(), "onTextDetected", event);
                }
            });
        }

        SurfaceView surfaceView = new SurfaceView(reactContext);
        SurfaceHolder surfaceHolder = surfaceView.getHolder();
        surfaceHolder.addCallback(new SurfaceHolder.Callback() {
            @Override
            public void surfaceCreated(SurfaceHolder surfaceHolder) {

                try {

                    mCameraSource.start(surfaceHolder);

                }
                catch (Exception e) {

                    Log.e("aquire camera", e.getMessage());
                }
            }

            @Override
            public void surfaceChanged(SurfaceHolder surfaceHolder, int i, int i1, int i2) {

                try {

                    if(mCameraSource != null) {

                        mCameraSource.stop();
                        mCameraSource.start(surfaceHolder);
                    }
                    /*
                    if(_camera != null) {
                        _camera.stopPreview();

                        _camera.setPreviewDisplay(surfaceHolder);
                        _camera.startPreview();
                    }
                    */
                }
                catch (Exception exception) {

                }
            }

            @Override
            public void surfaceDestroyed(SurfaceHolder surfaceHolder) {

                if(mCameraSource != null) {

                    mCameraSource.stop();
                    mCameraSource.release();
                    mCameraSource = null;
                }
/*
                if(_camera != null) {
                    _camera.stopPreview();
                    _camera.release();
                    _camera = null;
                }
                */
            }
        });
        container.addView(surfaceView);

        return container;
    }
}
