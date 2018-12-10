package com.example.jamie.mobilegamedevelopmentcoursework;

import android.content.Context;
import android.content.res.AssetFileDescriptor;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.SoundPool;
import android.os.Build;
import android.webkit.JavascriptInterface;

public class SoundManager
{
    private Context soundContext;
    private SoundPool soundList = null;
    private int[] soundIDs = new int[2];
    private String[] musicIDs = new String[1];
    private MediaPlayer backgroundMusic;
    // this function sets up and loads all of the sound files to be used in the application
    SoundManager(final Context context)
    {
        //cache the app context
        soundContext = context;

        //creates a sound pool depending on the version of the SDK
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            soundList = new SoundPool.Builder().setMaxStreams(3).setAudioAttributes(new AudioAttributes.Builder().setContentType(AudioAttributes.CONTENT_TYPE_MUSIC).build()).build();
        }
        else {
            soundList = new SoundPool(3, AudioManager.STREAM_MUSIC, 0);
        }
        musicIDs[0] = "music.mp3";
        backgroundMusic = new MediaPlayer();
        //these try catch statements load the sound effects and place them into the sound id array
        try {
            AssetFileDescriptor fileName = soundContext.getAssets().openFd("GroundHit.mp3");
            soundIDs[1] = soundList.load(fileName.getFileDescriptor(), fileName.getStartOffset(), fileName.getLength(), 0);
            fileName.close();
        }
        catch(Exception error)
        {
            error.printStackTrace();
        }

        try {
            AssetFileDescriptor fileName = soundContext.getAssets().openFd("ScoreSound.mp3");
            soundIDs[0] = soundList.load(fileName.getFileDescriptor(), fileName.getStartOffset(), fileName.getLength(), 0);
            fileName.close();
        }
        catch(Exception error)
        {
            error.printStackTrace();
        }

    }
    //this function is responsible for playing the games music
    @JavascriptInterface
    public void playMusic(int id)
    {
        //reset player
        backgroundMusic.reset();
        //this try catch statement loads and prepares the audio file for the music if it is present
        try
        {
            AssetFileDescriptor afd = soundContext.getAssets().openFd(musicIDs[id]);
            backgroundMusic.setDataSource(afd.getFileDescriptor(), afd.getStartOffset(), afd.getLength());
            afd.close();
            backgroundMusic.setLooping(true);
            backgroundMusic.prepare();
        }
        catch (Exception error)
        {
            error.printStackTrace();
        }
        //starts playing the audio track
        backgroundMusic.start();
    }
    //a sound id is passed into this function which then plays the corresponding sound effect
    @JavascriptInterface
    public void playSound(int id)
    {
        soundList.play(soundIDs[id], 1, 1, 0, 0, 1);
    }
}
