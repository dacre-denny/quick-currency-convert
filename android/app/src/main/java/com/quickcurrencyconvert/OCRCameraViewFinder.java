package com.quickcurrencyconvert;

import android.content.Context;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.util.Log;
import android.view.TextureView;

import java.util.concurrent.BlockingQueue;
import java.util.concurrent.LinkedBlockingQueue;

/**
 * Created by Dacre on 11/06/2017.
 */

public class OCRCameraViewFinder extends TextureView implements TextureView.SurfaceTextureListener, Camera.PreviewCallback {

    private int _cameraType;
    private int _captureMode;
    private SurfaceTexture _surfaceTexture;
    private int _surfaceTextureWidth;
    private int _surfaceTextureHeight;
    private boolean _isStarting;
    private boolean _isStopping;
    private boolean isStarted;
    private Camera _camera;
    private BlockingQueue<byte[]> mOCRQueue;

    public OCRCameraViewFinder(Context context) {
        super(context);

        mOCRQueue = new LinkedBlockingQueue<byte[]>();
    }

    public void aquireCamera() {

        releaseCamera();

        try {

            Camera camera = Camera.open(Camera.CameraInfo.CAMERA_FACING_BACK);
            Camera.Parameters parameters = camera.getParameters();

            Camera.Size previewSize = parameters.getSupportedPreviewSizes().get(0);

            parameters.setPreviewSize(previewSize.width, previewSize.height);

            camera.setParameters(parameters);

            camera.setPreviewCallback(this);

            _camera = camera;

            return;
        }
        catch (Exception e) {

            Log.e("aquire camera", e.getMessage());
        }
    }

    void releaseCamera() {

        try {
            if (_camera != null) {
                _camera.stopPreview();
                // stop sending previews to `onPreviewFrame`
                _camera.setPreviewCallback(null);
                //RCTCamera.getInstance().releaseCameraInstance(_cameraType);
                _camera = null;
            }

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            _isStopping = false;
        }
    }

    @Override
    public void onPreviewFrame(byte[] bytes, Camera camera) {

        if(mOCRQueue!=null && bytes != null){
            boolean addedToQueue = mOCRQueue.offer(bytes);
        }
    }

    @Override
    public void onSurfaceTextureAvailable(SurfaceTexture surfaceTexture, int w, int h) {

        _surfaceTexture = surfaceTexture;

        aquireCamera();
    }

    @Override
    public void onSurfaceTextureSizeChanged(SurfaceTexture surfaceTexture, int i, int i1) {

    }

    @Override
    public boolean onSurfaceTextureDestroyed(SurfaceTexture surfaceTexture) {

        _surfaceTexture = null;
        _surfaceTextureWidth = 0;
        _surfaceTextureHeight = 0;

        releaseCamera();

        return true;
    }

    @Override
    public void onSurfaceTextureUpdated(SurfaceTexture surfaceTexture) {

    }

    public void start() {

        if(!isStarted) {
            aquireCamera();
            isStarted = true;
        }
    }

    public void stop() {

        if(isStarted) {
            releaseCamera();
            isStarted = false;
        }
    }
}
