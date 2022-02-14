
const nav = document.querySelector('.anchor-links');

const icons = {
  off: 'highlight_off',
  on: 'list'
};

const scrollOptions = {
  delay: 400,
  duration: 777,
  offset: 60
};

let obeserveOptions = {
  root: null,
  rootMargin: '0px 0px 0px 0px',
  threshold: [0, 0.25, 0.5, 0.75, 1],
};

const clickEvent = new MouseEvent("click", {
  "view": window,
  "bubbles": true,
  "cancelable": false
});

let breakpoint = null;

// const observeRatio = (entry, trigger) => {
//
//   if (entry.intersectionRatio > 0) {
//     trigger.classList.add('active');
//   }
//   else {
//     trigger.classList.remove('active');
//   }
// }

const navObserver = new IntersectionObserver((entries, self) => {

  entries.forEach(entry => {
    breakpoint = parseInt(entry.boundingClientRect.y + entry.boundingClientRect.height);
    if (entry.intersectionRatio == 0) {
      entry.target.classList.add('sticky');
      entry.target.classList.remove('expanded');
      processIcon(entry.target.querySelector('h4.title'), icons.on);
      entry.target.querySelector('ul').classList.add('hidden');
    }
    // else if (entry.intersectionRatio > 0 && entry.intersectionRatio < 0.25) {
    //   //breakpoint = parseFloat(entry.boundingClientRect.y + entry.boundingClientRect.height);
    // }
    // else if (entry.intersectionRatio == 1) {
    //   if (entry.target.classList.contains('sticky')) {
    //   }
    //   if (window.scrollY < breakpoint) {
    //   }
    //   // entry.target.classList.remove('sticky');
    //   // if (!getCurrent(entry.target)) {
    //   //   entry.target.classList.add('expanded');
    //   //   entry.target.querySelector('ul').classList.remove('hidden');
    //   //   processIcon(entry.target.querySelector('h4.title'), icons.off);
    //   // }
    // }
  });
}, obeserveOptions);

const observer = new IntersectionObserver((entries, self) => {
  entries.forEach(entry => {
    const id = entry.target.getAttribute('id');
    const trigger = id ? document.querySelector('nav li a[href="#' + id + '"]').parentElement : null;

    if (trigger) {

      if (entry.intersectionRatio > 0) {
        trigger.classList.add('active');
      }
      else {
        trigger.classList.remove('active');
      }

      // observeRatio(entry, trigger);
    }
  });
}, obeserveOptions);

const getCurrent = (nav) => {
  let id = null;
  nav.querySelectorAll('ul li a').forEach((trigger) => {
    if (trigger.getAttribute('href') && trigger.getAttribute('href') === location.hash) {
      id = trigger.getAttribute('href');
    }
  });
  return id;
}

const processIcon = (parent, icon) => {
  const iconElement = parent ? parent.querySelector('i') : null;
  if (iconElement) {
    if (icon) {
      iconElement.textContent = icon;
    }
    else {
      iconElement.textContent = iconElement.textContent === icons.on ? icons.off : icons.on;
    }
  }
}

const anchorTriggers = (viewport, reset) => {

  // if (zenscroll !== 'undefined') {
  //  zenscroll.setup(scrollOptions.duration, scrollOptions.offset);
  // }
  let first = false;
  nav.querySelectorAll('ul li a').forEach((trigger, index) => {

    let top;

    trigger.onclick = (event) => {

      const id = trigger.getAttribute('href') ? trigger.getAttribute('href').replace('#', '') : null;
      const target = id ? document.getElementById(id) : null;

      //event.preventDefault();

      if (target) {

        // Desktop handling.
        if (viewport === 'desktop') {
          if (window.hasOwnProperty('zenscroll')) {
            zenscroll.intoView(target);
          }
          // Note: If no zescroll we just let deefault browser behavior -
          // upon clicking on anchor link.
          return;
        }

        // Mobile handling.
        nav.querySelector('.anchor-links h4.title').dispatchEvent(clickEvent);

        const timeout = setTimeout(function(t) {

          top = Math.abs(nav.offsetHeight - t.offsetTop);

          if (window.hasOwnProperty('zenscroll')) {
            zenscroll.toY(top, scrollOptions.duration, function() {
              clearTimeout(timeout);
            });
          }
          else {
            window.scroll({
              top: top,
              left: 0,
              behavior: 'smooth'
            });
          }
        }, scrollOptions.delay, target);
      }
    };
  });
};

window.addEventListener('DOMContentLoaded', () => {

  // Mobile only logic.
  if (window.outerWidth < 701) {

    // Watch navigation.
    document.querySelectorAll('.anchor-links').forEach((navigation) => {
      const breakpoint = parseInt(navigation.offsetTop + navigation.offsetHeight);
      navObserver.observe(navigation);
    });

    window.addEventListener('scroll', function() {
      document.querySelectorAll('.anchor-links').forEach((navigation) => {
        const breakpoint = parseInt(navigation.offsetTop + navigation.offsetHeight);
        if (navigation.classList.contains('sticky')) {
          if (window.scrollY < breakpoint) {
            navigation.classList.remove('sticky');
            //if (!getCurrent(navigation)) {
              navigation.classList.add('expanded');
              navigation.querySelector('ul').classList.remove('hidden');
              processIcon(navigation.querySelector('h4.title'), icons.off);
            //}
          }
        }
      });
    });

    // Watch our sections.
	  document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    let reset = false;

    // Topics links clicks.
    anchorTriggers('mobile');
  }
  // Desktop
  else {
    // Watch our sections.
    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });
    anchorTriggers('desktop');
  }

  // Heading toggle, for list of topics visibility.
  nav.querySelectorAll('h4.title').forEach((topic) => {
    topic.onclick = (event) => {
      processIcon(event.currentTarget);
      nav.classList.toggle('expanded');
      nav.querySelector('ul').classList.toggle('hidden');
    };
  });

});
