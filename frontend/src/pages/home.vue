<template>
  <Layout class="flex flex-wrap font-sans">
    <section class="w-full bg-blue-lighter py-12 px-8">
      <div class="w-3/4 ml-auto mr-auto">
        <p class="text-7xl text-center font-extrabold">
          Three weeks. Full time. Your own path to learn web development.
        </p>
        <h1 class="text-6xl text-center font-medium">
          Code Lab 517
        </h1>
        <p class="text-xl text-center">
          Brought to you by LEAP, Lansing Regional SmartZone, and Lansing.Codes
        </p>
      </div>
    </section>

    <section class="w-full bg-white py-12">
      <div class="w-3/4 ml-auto mr-auto">
        <h2 class="text-4xl pb-6">
          How it works
        </h2>
        <ol>
          <li class="mb-2 lead">
            <strong>Chart your course:</strong>
            Identify which web development topics and skills you want to learn
          </li>
          <li class="mb-2 lead">
            <strong>Read lessons:</strong>
            Lessons are text-based so you can go at your own pace.
          </li>
          <li class="mb-2 lead">
            <strong>Do projects:</strong>
            Each lesson culminates in a complete website or application from
            scratch.
          </li>
          <li class="mb-2 lead">
            <strong>Get reviews:</strong>
            Coaches will provide personalized feedback on your code. Keep making
            changes until it meets requirements - just like real life.
          </li>
          <li class="mb-2 lead">
            <strong>Network and grow:</strong>
            Work from our lab for maximum networking and assistance. Coaches are
            also available to talk with you about your personal code goals,
            business ideas, and career plans.
          </li>
        </ol>
      </div>
    </section>

    <section class="w-full bg-purple-lighter py-12">
      <div class="w-3/4 ml-auto mr-auto">
        <section class="mb-5">
          <h2 class="mb-3">
            Details
          </h2>
          <ul>
            <li>October 15 - November 2, 2018</li>
            <li>Weekdays 9am - 5pm</li>
            <li>The Potter's Mill, Lansing</li>
            <li>$1,000 (scholarships available)</li>
          </ul>
        </section>

        <section class="mb-5">
          <h2 class="mb-3">
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

        <section class="col-sm mb-5">
          <h2 class="mb-3">
            Topics
          </h2>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>Sass</li>
            <li>JavaScript</li>
            <li>NodeJS</li>
            <li>Express</li>
            <li>Managing dependencies with NPM</li>
            <li>SQL</li>
            <li>Firebase</li>
            <li>Git and Github</li>
            <li>working with the command line</li>
            <li>hosting sites on free platforms</li>
            <li>SEO basics</li>
            <li>Usability and accessibility basics</li>
            <li>Creating apps for iOS and Android</li>
          </ul>
        </section>
      </div>
    </section>

    <section class="w-full bg-teal-light py-12">
      <div class="w-1/2 ml-auto mr-auto text-center">
        <button class="button btn-primary btn-lg d-block mx-auto">
          Apply today
        </button>
      </div>
    </section>
  </Layout>
</template>

<script>
import Layout from '@layouts/bare'

export default {
  components: {
    Layout
  }
}
</script>
