/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

package com.aptitekk.aptibook.core.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.concurrent.atomic.AtomicBoolean;

@Service
@Scope(BeanDefinition.SCOPE_SINGLETON)
public class DevService {

    private SpringProfileService springProfileService;
    private LogService logService;
    private ProcessMonitor devServerMonitor;

    @Autowired
    public DevService(SpringProfileService springProfileService, LogService logService) {
        this.springProfileService = springProfileService;
        this.logService = logService;
    }

    @PostConstruct
    private void init() {
        if (springProfileService.isProfileActive(SpringProfileService.Profile.DEV)) {
            logService.logInfo(getClass(), "Development Mode is Enabled");
            startWebpackWatcher();
        }
    }

    private void startWebpackWatcher() {
        try {
            devServerMonitor = new ProcessMonitor("Webpack Watcher", "node_modules/.bin/webpack.cmd", "--watch", "--watchOptions.poll=300") {
                boolean keepPrinting;

                @Override
                public void processLine(String line) {
                    if (keepPrinting && line.contains("hidden")) {
                        logService.logInfo(getClass(), "----");
                        keepPrinting = false;
                    }

                    if (keepPrinting)
                        logService.logInfo(getClass(), line);

                    if (line.contains("Version: webpack")) {
                        logService.logInfo(getClass(), "Web Files Reloaded.");
                        keepPrinting = true;
                    }
                }
            };
            devServerMonitor.start();

            logService.logInfo(getClass(), "Webpack Watcher started.");
        } catch (IOException e) {
            logService.logInfo(getClass(), "Failed to start Webpack Watcher");
            e.printStackTrace();
        }
    }

    @PreDestroy
    private void destroy() {
        if (devServerMonitor != null) {
            logService.logInfo(getClass(), "Stopping Webpack Watcher");
            devServerMonitor.cancel();
        }
    }

    private abstract class ProcessMonitor extends Thread {

        private Process process;

        private AtomicBoolean cancelled = new AtomicBoolean(false);

        private ProcessMonitor(String processName, String... args) throws IOException {
            super(processName);
            ProcessBuilder processBuilder = new ProcessBuilder(args);
            //Combine the error and output streams into one.
            processBuilder.redirectErrorStream(true);
            this.process = processBuilder.start();
        }

        @Override
        public void run() {
            if (this.process == null)
                return;

            //To keep the process running, the output streams must be consumed,
            // otherwise the streams will overflow and the program will hang.
            try {
                BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(process.getInputStream()));
                while (true) {
                    if (cancelled.get())
                        break;

                    String line = bufferedReader.readLine();
                    if (line == null)
                        break;
                    else
                        processLine(line);

                }
            } catch (IOException e) {
                e.printStackTrace();
            }

            this.process.destroy();
        }

        public abstract void processLine(String line);

        public void cancel() {
            this.cancelled.set(true);
        }

    }

}
