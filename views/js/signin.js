let themeableContainer;

tsParticles
  .load("tsparticles", {
    fpsLimit: 60,
    fullScreen: { enable: true },
    particles: {
      number: {
        value: 50
      },
      shape: {
        type: "circle"
      },
      opacity: {
        value: 0.5
      },
      size: {
        value: 400,
        random: {
          enable: true,
          minimumValue: 200
        }
      },
      move: {
        enable: true,
        speed: 10,
        direction: "top",
        outMode: "destroy"
      }
    },
    interactivity: {
      detectsOn: "canvas",
      events: {
        resize: true
      }
    },
    detectRetina: true,
    themes: [
      {
        name: "light",
        default: {
          value: true,
          mode: "light"
        },
        options: {
          background: {
            color: "#f7f8ef"
          },
          particles: {
            color: {
              value: ["#5bc0eb", "#fde74c", "#9bc53d", "#e55934", "#fa7921"]
            }
          }
        }
      },
      {
        name: "dark",
        default: {
          value: true,
          mode: "dark"
        },
        options: {
          background: {
            color: "#080710"
          },
          particles: {
            color: {
              value: ["#004f74", "#5f5800", "#245100", "#7d0000", "#810c00"]
            }
          }
        }
      }
    ],
    emitters: {
      direction: "top",
      position: {
        x: 50,
        y: 150
      },
      rate: {
        delay: 0.2,
        quantity: 2
      },
      size: {
        width: 100,
        height: 0
      }
    }
  })
  .then((container) => (themeableContainer = container));

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    const newColorScheme = e.matches ? "dark" : "light";

    themeableContainer.loadTheme(newColorScheme);
  });


  const container = document.querySelector(".container"), 
  pwShowHide = document.querySelectorAll(".showHidePw"),
  pwFields = document.querySelectorAll(".password"),
  signup = document.querySelector(".signup-link"),
  login = document.querySelector(".login-link");

  pwShowHide.forEach(eyeIcon => {
      eyeIcon.addEventListener("click", () => {
          pwFields.forEach(pwField => {
              if(pwField.type === "password") {
                  pwField.type = "text";

                  pwShowHide.forEach(icon => {
                    icon.classList.replace("uil-eye-slash", "uil-eye");
                  })
                }else {
                    pwField.type = "password";

                    pwShowHide.forEach(icon => {
                        icon.classList.replace("uil-eye", "uil-eye-slash");
                    })
                }
          })
      })
  })

  signup.addEventListener("click", () => {
      container.classList.add("active");
  })

  login.addEventListener("click", () => {
    container.classList.remove("active");
})