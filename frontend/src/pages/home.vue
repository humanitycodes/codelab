<template>
  <Layout class="flex flex-wrap landing">
    <header class="fixed pin-t pin-x z-100">
      <div class="w-2/3 text-left font-bold">
        <img
          class="inline-block mr-1 w-8 align-middle"
          src="../assets/images/logo-white.png"
          alt="Code Lab 517 Logo"
        />
        Code Lab 517
      </div>
      <div class="w-1/3 text-right">
        <ul class="nav-list">
          <li>
            <router-link
              to="/github-sign-in"
              class="pl-4 font-medium text-base"
            >
              Sign In
            </router-link>
          </li>
          <li>
            <a
              class="icon-link"
              href="https://www.facebook.com/LansingCodes/"
              target="_blank"
            >
              <span class="sr-only">Facebook</span>
              <i class="fab fa-facebook" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a
              class="icon-link"
              href="https://twitter.com/lansingcodes"
              target="_blank"
            >
              <span class="sr-only">Twitter</span>
              <i class="fab fa-twitter" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a
              class="icon-link"
              href="mailto:lansingcodes@gmail.com?subject=Question%20about%20Code%20Lab%20517"
              target="_blank"
            >
              <span class="sr-only">Email us</span>
              <i class="fas fa-envelope" aria-hidden="true"></i>
            </a>
          </li>
        </ul>
      </div>
    </header>

    <section class="bg-digital bg-blue-lighter md:px-8">
      <div class="text-center">
        <p class="text-3xl md:text-7xl font-extrabold">
          Three weeks. Learn to code.
        </p>
        <a
          class="application-link"
          :href="applicationUrl"
          target="_blank"
        >
          <h1 class="text-3xl md:text-6xl font-medium font-mono whitespace-no-wrap mx-auto">
            &gt; {{ typedText }}{{ textCursor }}{{ textPadding }}
          </h1>
        </a>
        <a
          class="application-link bg-transparent font-mono font-medium mx-auto"
          :href="applicationUrl"
          target="_blank"
        >
          [ Press Enter to apply ]
        </a>
        <p class="md:text-xl font-medium">
          Brought to you by
          <abbr title="Lansing Economic Area Partnership">LEAP</abbr>,
          Lansing Regional SmartZone,
          and Lansing.Codes
        </p>
      </div>
    </section>

    <section class="bg-white">
      <div>
        <h2 class="text-center text-4xl pb-6">
          How it works
        </h2>
        <div class="w-full flex flex-wrap">
          <div class="max-w-md lg:max-w-sm w-full sm:flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-48 sm:h-auto sm:w-48 flex-none bg-cover bg-center rounded-t sm:rounded-t-none sm:rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/Rc1OZs2.png')"
              title="Chart your course"
            ></div>
            <div class="bg-white rounded-b sm:rounded-b-none sm:rounded-r p-4 flex flex-col justify-between leading-normal">
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

          <div class="max-w-md lg:max-w-sm w-full sm:flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-48 sm:h-auto sm:w-48 flex-none bg-cover rounded-t sm:rounded-t-none sm:rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/GYvIlUH.png')"
              title="Explore topics"
            ></div>
            <div class="bg-white rounded-b sm:rounded-b-none sm:rounded-r p-4 flex flex-col justify-between leading-normal">
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

          <div class="max-w-md lg:max-w-sm w-full sm:flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-48 sm:h-auto sm:w-48 flex-none bg-cover bg-center rounded-t sm:rounded-t-none sm:rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/s3lKmaX.jpg')"
              title="Do coding projects"
            ></div>
            <div class="bg-white rounded-b sm:rounded-b-none sm:rounded-r p-4 flex flex-col justify-between leading-normal">
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

          <div class="max-w-md lg:max-w-sm w-full sm:flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-48 sm:h-auto sm:w-48 flex-none bg-cover bg-center rounded-t sm:rounded-t-none sm:rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/n9rn4VR.jpg')"
              title="Get reviews"
            ></div>
            <div class="bg-white rounded-b sm:rounded-b-none sm:rounded-r p-4 flex flex-col justify-between leading-normal">
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

          <div class="max-w-md lg:max-w-sm w-full sm:flex rounded shadow-lg mb-12 mx-auto">
            <div
              class="h-48 sm:h-auto sm:w-48 flex-none bg-cover rounded-t sm:rounded-t-none sm:rounded-l text-center overflow-hidden"
              style="background-image: url('https://i.imgur.com/T9RVkaY.jpg')"
              title="Network and grow"
            ></div>
            <div class="bg-white rounded-b sm:rounded-b-none sm:rounded-r p-4 flex flex-col justify-between leading-normal">
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
            <li>October 15 to November 2, 2018</li>
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
              <figcaption>
                <abbr title="Hypertext Markup Language, version 5">HTML5</abbr>
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-css3 fa-5x text-blue-dark"></i>
              <figcaption>
                <abbr title="Cascading Stylesheets, version 3">CSS3</abbr>
              </figcaption>
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
              <figcaption>
                <acronym title="Node JavaScript">NodeJS</acronym>
              </figcaption>
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
              <figcaption>
                Managing dependencies with
                <abbr title="Node Package Manager">NPM</abbr>
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fas fa-database fa-5x text-grey-dark"></i>
              <figcaption>
                <abbr title="Structured Query Language">SQL</abbr>
              </figcaption>
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
              <figcaption>
                <abbr title="Search Engine Optimization">SEO</abbr> basics
              </figcaption>
            </figure>
          </li>
          <li>
            <figure>
              <i class="fab fa-accessible-icon fa-5x text-yellow-dark"></i>
              <figcaption>Usability and accessibility basics</figcaption>
            </figure>
          </li>
        </ul>
      </div>
    </section>

    <section class="bg-grey-lighter">
      <div class="text-center">
        <button
          class="button-apply mx-auto"
          @click="openApplication"
        >
          Apply today
        </button>
      </div>
    </section>

    <section class="bg-white">
      <div class="text-center">
        <h2 class="text-4xl pb-6 text-center">
          Have questions?
        </h2>
        <p class="text-2xl font-medium mt-0">
          <a
            class="icon-link"
            href="mailto:lansingcodes@gmail.com?subject=Question%20about%20Code%20Lab%20517"
            target="_blank"
          >
            Contact us!
            <i class="far fa-envelope" aria-hidden="true"></i>
          </a>
        </p>
      </div>
    </section>

    <footer>
      <div class="w-2/3 text-left">
        &copy; {{ currentYear }} Humanity Codes, LLC
      </div>
      <div class="w-1/3 text-right">
        <ul class="nav-list">
          <li>
            <a
              class="icon-link"
              href="https://www.facebook.com/LansingCodes/"
              target="_blank"
            >
              <span class="sr-only">Facebook</span>
              <i class="fab fa-facebook" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a
              class="icon-link"
              href="https://twitter.com/lansingcodes"
              target="_blank"
            >
              <span class="sr-only">Twitter</span>
              <i class="fab fa-twitter" aria-hidden="true"></i>
            </a>
          </li>
          <li>
            <a
              class="icon-link"
              href="mailto:lansingcodes@gmail.com?subject=Question%20about%20Code%20Lab%20517"
              target="_blank"
            >
              <span class="sr-only">Email us</span>
              <i class="fas fa-envelope" aria-hidden="true"></i>
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
