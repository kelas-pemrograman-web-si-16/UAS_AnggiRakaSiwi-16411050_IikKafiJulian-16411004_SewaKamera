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
public class Login_form extends AppCompatActivity {
    @BindView(R.id.edUser)
    EditText edUser;
    @BindView(R.id.edPass)
    EditText edPass;
    String strUser;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login_form);
        ButterKnife.bind(this);
        Intent getData = getIntent();
        strUser = getData.getStringExtra("user");

        edUser.setText(strUser);
    }
    @OnClick(R.id.btnRegis)
    void btnRegis (){
        Intent a = new Intent(Login_form.this,
                Regis_form.class);
        startActivity(a);
        finish();
    }

    @OnClick(R.id.btnLogin)
    void btnLogin() {
        String strUser, strPass;

        strUser = edUser.getText().toString();
        strPass = edPass.getText().toString();

        if (strUser.isEmpty() || strPass.isEmpty()) {
            Toast.makeText(getApplicationContext(),
                    "Lengkapi data", Toast.LENGTH_LONG).show();
        } else {
            Intent a = new Intent(Login_form.this,
                    Home_form.class);
            startActivity(a);
            finish();
        }
    }
}
