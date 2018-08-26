<template>
  <Layout class="flex flex-wrap landing">
    <section class="bg-blue-lighter px-8">
      <div>
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

    <section class="bg-white">
      <div>
        <h2 class="text-4xl pb-6">
          How it works
        </h2>
        <ol>
          <li>
            <strong>Chart your course:</strong>
            Identify which web development topics and skills you want to learn
          </li>
          <li>
            <strong>Read lessons:</strong>
            Lessons are text-based so you can go at your own pace.
          </li>
          <li>
            <strong>Do projects:</strong>
            Each lesson culminates in a complete website or application from
            scratch.
          </li>
          <li>
            <strong>Get reviews:</strong>
            Coaches will provide personalized feedback on your code. Keep making
            changes until it meets requirements - just like real life.
          </li>
          <li>
            <strong>Network and grow:</strong>
            Work from our lab for maximum networking and assistance. Coaches are
            also available to talk with you about your personal code goals,
            business ideas, and career plans.
          </li>
        </ol>
      </div>
    </section>

    <section class="bg-purple-lighter">
      <div>
        <section class="mb-5">
          <h2 class="text-4xl pb-6">
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

        <section class="col-sm mb-5">
          <h2 class="text-4xl pb-6">
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

    <section class="bg-teal-light">
      <div class="text-center">
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
