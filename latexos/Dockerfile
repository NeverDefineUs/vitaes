FROM ubuntu:16.04
RUN apt-get update && apt-get install -y python3 python3-pip \
    texlive-latex-base texlive-fonts-recommended texlive-fonts-extra \
    texlive-latex-extra texlive-xetex texlive-math-extra unzip locales && \
    rm -rf /var/lib/apt/lists/*
RUN locale-gen en pt
RUN update-locale
