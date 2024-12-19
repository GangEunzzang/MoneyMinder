package com.moneyminder.global.config;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class Test {

    public static void main(String[] args) throws IOException {
        Map<String, Integer> map = new HashMap<>();

        System.out.println("원본을 콘솔에 입력해주세요.");
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String next = "";

        while ((next = br.readLine()) != null) {
            if (next.equals("exit"))
                break;
            map.put(next, map.getOrDefault(next, 0) + 1);
        }

        map.forEach((k, v) -> {
                    if (v == 1) {
                        System.out.println(k);
                    }
                }
        );
    }


}
