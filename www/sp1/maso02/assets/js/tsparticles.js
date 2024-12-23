tsParticles.load({
    id: "tsparticles",
    options: {
        fullScreen: {
            enable: false
        },
        fpsLimit: 60,
        particles: {
            number: {
                value: 50
            },
            links: {
                enable: true,
                distance: 120,
                color: "#37863a"
            },
            move: {
                enable: true,
                speed: 0.5,
                outModes: {
                    default: "bounce"
                }
            },
            size: {
                value: 1
            },
            color: "#37863a",
        },
        interactivity: {
            events: {
                onClick: {
                    enable: true,
                    mode: "repulse",
                },
                onHover: {
                    enable: true,
                    mode: "grab",
                },
            },
            modes: {
                grab: {
                    distance: 150,
                },
                repulse: {
                    distance: 75,
                },
            },
        },
    }
});