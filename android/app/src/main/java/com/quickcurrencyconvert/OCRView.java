package com.quickcurrencyconvert;

import android.Manifest;
import android.content.Context;
import android.support.annotation.RequiresPermission;
import android.view.SurfaceView;
import android.view.View;
import android.view.ViewGroup;

import java.io.IOException;

/**
 * Created by Dacre on 10/06/2017.
 */

public class OCRView extends ViewGroup {

    private static final String TAG = "CameraSourcePreview";

    private OCRCameraViewFinder viewFinder;

    private Context mContext;
    private SurfaceView mSurfaceView;
    private boolean mStartRequested;
    private boolean mSurfaceAvailable;
    private CameraSource mCameraSource;

    //private GraphicOverlay mOverlay;

    public OCRView(Context context) {
        super(context);
        mContext = context;
        mStartRequested = false;
        mSurfaceAvailable = false;

        viewFinder = new OCRCameraViewFinder(context);
        addView(viewFinder);

        mSurfaceView = new SurfaceView(context);
    }

    @Override
    protected void onLayout(boolean b, int left, int top, int right, int bottom) {

        if (null == viewFinder) {
            return;
        }

        viewFinder.layout(left, top, right, bottom);
        //viewFinder.start();

        this.postInvalidate(this.getLeft(), this.getTop(), this.getRight(), this.getBottom());
    }

    @Override
    public void onViewAdded(View child) {
        if(viewFinder == child) return;

        this.removeView(this.viewFinder);
        this.addView(this.viewFinder, 0);
    }

    @RequiresPermission(Manifest.permission.CAMERA)
    public void start(CameraSource cameraSource) throws IOException, SecurityException {


        mCameraSource = cameraSource;

        if (mCameraSource != null) {
            mStartRequested = true;
        }
    }

//    @RequiresPermission(Manifest.permission.CAMERA)
//    public void start(CameraSource cameraSource, GraphicOverlay overlay) throws IOException, SecurityException {
//       // mOverlay = overlay;
//        start(cameraSource);
//    }
}
