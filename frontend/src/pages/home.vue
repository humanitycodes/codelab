<template>
  <Layout class="flex flex-wrap landing">
    <header class="fixed pin-t pin-x z-100">
      <div class="w-3/4 text-left font-bold">
        <img class="inline-block mr-1 w-8 align-middle" src="../assets/images/logo-white.png" alt="Code Lab 517 Logo">
        Code Lab 517
      </div>
      <div class="w-1/4 text-right">
        <ul class="nav-list">
          <li>
            <a
              class="icon-link"
              href="https://www.facebook.com/LansingCodeLab/"
              target="_blank"
            >
              <i class="fab fa-facebook"></i>
            </a>
          </li>
          <li>
            <a
              class="icon-link"
              href="https://twitter.com/lansingcodes"
              target="_blank"
            >
              <i class="fab fa-twitter"></i>
            </a>
          </li>
        </ul>
      </div>
    </header>

    <section class="bg-digital bg-blue-lighter px-8">
      <div class="text-center">
        <p class="text-7xl font-extrabold">
          Three weeks. Full time. Learn to code.
        </p>
        <h1 class="text-6xl font-medium font-mono whitespace-no-wrap mx-auto">
          &gt; {{ typedText }}{{ textCursor }}{{ textPadding }}
        </h1>
        <a
          class="application-link bg-transparent font-mono font-medium mx-auto"
          :href="applicationUrl"
          target="_blank"
        >
          [ Press Enter to apply ]
        </a>
        <p class="text-xl font-medium">
          Brought to you by LEAP, Lansing Regional SmartZone, and Lansing.Codes
        </p>
      </div>
    </section>

    <section class="bg-white">
      <div>
        <h2 class="text-center text-4xl pb-6">
          How it works
        </h2>
        <div class="w-full flex flex-wrap">
          <div class="max-w-md lg:max-w-sm flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-auto w-48 flex-none bg-cover rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/Rc1OZs2.png')"
              title="Chart your course"
            ></div>
            <div class="bg-white rounded-r p-4 flex flex-col justify-between leading-normal">
              <div class="mb-8">
                <div class="text-black font-bold text-xl mb-2">
                  1. Chart your course
                </div>
                <p class="text-grey-darker text-base">
                  Identify which coding topics and skills you want to learn. No
                  previous coding experience is required.
                </p>
              </div>
            </div>
          </div>

          <div class="max-w-md lg:max-w-sm flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-auto w-48 flex-none bg-cover rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/GYvIlUH.png')"
              title="Explore topics"
            ></div>
            <div class="bg-white rounded-r p-4 flex flex-col justify-between leading-normal">
              <div class="mb-8">
                <div class="text-black font-bold text-xl mb-2">
                  2. Explore topics
                </div>
                <p class="text-grey-darker text-base">
                  Each lesson covers a single topic, allowing you to focus your
                  learning. Lessons are text-based so you can go at your own pace.
                </p>
              </div>
            </div>
          </div>

          <div class="max-w-md lg:max-w-sm flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-auto w-48 flex-none bg-cover rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/s3lKmaX.jpg')"
              title="Do coding projects"
            ></div>
            <div class="bg-white rounded-r p-4 flex flex-col justify-between leading-normal">
              <div class="mb-8">
                <div class="text-black font-bold text-xl mb-2">
                  3. Do coding projects
                </div>
                <p class="text-grey-darker text-base">
                  Each lesson culminates with a complete website or application
                  from scratch. Completed projects unlock new lessons that build
                  on what you've already learned.
                </p>
              </div>
            </div>
          </div>

          <div class="max-w-md lg:max-w-sm flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-auto w-48 flex-none bg-cover rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/n9rn4VR.jpg')"
              title="Get reviews"
            ></div>
            <div class="bg-white rounded-r p-4 flex flex-col justify-between leading-normal">
              <div class="mb-8">
                <div class="text-black font-bold text-xl mb-2">
                  4. Get reviews
                </div>
                <p class="text-grey-darker text-base">
                  Coaches provide personalized feedback on your code. Keep making
                  changes until it meets requirements &mdash; just like real life.
                </p>
              </div>
            </div>
          </div>

          <div class="max-w-md lg:max-w-sm flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-auto w-48 flex-none bg-cover rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/T9RVkaY.jpg')"
              title="Network and grow"
            ></div>
            <div class="bg-white rounded-r p-4 flex flex-col justify-between leading-normal">
              <div class="mb-8">
                <div class="text-black font-bold text-xl mb-2">
                  5. Network and grow
                </div>
                <p class="text-grey-darker text-base">
                  Work from our lab for maximum networking and assistance. Coaches
                  are also available to talk with you about your personal goals,
                  business ideas, and career plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="bg-grey-lighter">
      <div class="split">
        <section class="mb-5 lg:w-1/3">
          <h2 class="text-4xl pb-6">
            Details
          </h2>
          <ul>
            <li>October 15 - November 2, 2018</li>
            <li>Weekdays, 9 am - 5 pm</li>
            <li>
              <a
                target="_blank"
                href="http://pottersmill.co/"
              >Potter's Mill, Lansing</a>
            </li>
            <li>$1,000 (scholarships available)</li>
          </ul>
        </section>

        <section class="mb-5 lg:w-2/3">
          <h2 class="text-4xl pb-6">
            This program might be for you:
          </h2>

          <ul>
            <li>
              Do you have an idea for a website or application, but don't
              know how to build it?
            </li>
            <li>
              Are you a designer who wants to add development to your skillset?
            </li>

            <li>
              Would you like to get more knowledgeable when talking to your
              company's developers?
            </li>
          </ul>
        </section>
      </div>
    </section>

    <section class="bg-white">
      <div>
        <h2 class="text-4xl pb-6 text-center">
          Topics covered
        </h2>
        <ul class="icon-list">
          <li>
            <figure>
              <i class="fab fa-html5 fa-5x text-orange-dark"></i>
              <figcaption>HTML5</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-css3 fa-5x text-blue-dark"></i>
              <figcaption>CSS3</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-sass fa-5x text-pink-dark"></i>
              <figcaption>Sass</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-js-square fa-5x text-yellow-dark"></i>
              <figcaption>JavaScript</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-node fa-5x text-green-dark"></i>
              <figcaption>NodeJS</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-random fa-5x text-blue-dark"></i>
              <figcaption>Express</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-npm fa-5x text-red-dark"></i>
              <figcaption>Managing dependencies with NPM</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-database fa-5x text-grey-dark"></i>
              <figcaption>SQL</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-fire fa-5x text-orange-dark"></i>
              <figcaption>Firebase</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-git fa-5x text-red"></i>
              <figcaption>Git and GitHub</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-terminal fa-3x text-white bg-grey-darkest p-5 rounded-lg"></i>
              <figcaption>Working with the command line</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-cloud-upload-alt fa-5x text-blue-light"></i>
              <figcaption>Hosting sites on free platforms</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-search fa-5x text-yellow-darkest"></i>
              <figcaption>SEO basics</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-accessible-icon fa-5x text-yellow-dark"></i>
              <figcaption>Usability and accessibility basics</figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-mobile-alt fa-5x"></i>
              <figcaption>Creating apps for iOS and Android</figcaption>
            </figure>
          </li>
        </ul>
      </div>
    </section>

    <section class="bg-black">
      <div class="text-center">
        <button
          class="button-apply mx-auto"
          @click="openApplication"
        >
          Apply today
        </button>
      </div>
    </section>

    <footer>
      <div class="w-3/4 text-left">
        &copy; {{ currentYear }} Humanity Codes, LLC
      </div>
      <div class="w-1/4 text-right">
        <ul class="nav-list">
          <li>
            <a
              class="icon-link"
              href="https://www.facebook.com/LansingCodeLab/"
              target="_blank"
            >
              <i class="fab fa-facebook"></i>
            </a>
          </li>
          <li>
            <a
              class="icon-link"
              href="https://twitter.com/lansingcodes"
              target="_blank"
            >
              <i class="fab fa-twitter"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </Layout>
</template>

<script>
import Layout from '@layouts/bare'

export default {
  components: {
    Layout
  },
  data () {
    return {
      applicationUrl: 'http://bit.ly/codelab517-apply-2018',
      currentYear: new Date().getFullYear(),
      textCursor: '_',
      textPadding: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0',
      title: 'Code Lab 517',
      typedText: ''
    }
  },
  mounted () {
    document.addEventListener('keyup', event => {
      if (event.keyCode === 13) {
        event.preventDefault()
        this.openApplication()
      }
    })

    setTimeout(this.updateTypedText, 1000)
  },
  methods: {
    blinkTextCursor () {
      this.textCursor = this.textCursor === '_' ? '\xa0' : '_'
      const self = this
      setTimeout(self.blinkTextCursor, 600)
    },
    openApplication () {
      window.open(this.applicationUrl, '_blank')
    },
    updateTypedText () {
      if (this.typedText === this.title) {
        this.blinkTextCursor()
        return
      }
      this.typedText += this.title[this.typedText.length]
      this.textPadding = this.textPadding.slice(1)
      const self = this
      setTimeout(self.updateTypedText, Math.floor(Math.random() * 80) + 100)
    }
  }
}
</script>
