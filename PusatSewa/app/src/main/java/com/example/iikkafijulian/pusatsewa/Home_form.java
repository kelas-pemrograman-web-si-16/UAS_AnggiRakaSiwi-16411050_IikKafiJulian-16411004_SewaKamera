package com.example.iikkafijulian.pusatsewa;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.iikkafijulian.pusatsewa.Home_form;
import com.example.iikkafijulian.pusatsewa.Regis_form;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;

public class Home_form extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home_form);
        ButterKnife.bind(this);
    }

    @OnClick(R.id.btnKamera)
    void btnKamera() {
        Intent a = new Intent(Home_form.this,
        kamera_form.class);
        startActivity(a);
        finish();
        }

    @OnClick(R.id.btnTripod)
    void btnTripod() {
        Intent a = new Intent(Home_form.this,
                tripod_form.class);
        startActivity(a);
        finish();
    }

    @OnClick(R.id.btnLensa)
    void btnLensa() {
        Intent a = new Intent(Home_form.this,
                lensa_form.class);
        startActivity(a);
        finish();
    }

        }