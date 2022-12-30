\set ON_ERROR_STOP on

--
-- Data for Name: lesson; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (218, 'js-localstorage', 'Save information in the browser with localStorage', 2, '## Where every page knows your name

You can now accept information from users, but there''s something missing. Take this code for example:

``` {.html}
<h1 id="greeting"></h1>
```
``` {.js}
const firstName = window.prompt(''What is your first name?'')
const greeting = document.getElementById(''greeting'')
greeting.textContent = ''Hi, '' + firstName
```

Every time the user refreshes the page, it would ask for their name all over again, as if they''d never met. It has no _long-term memory_. Kind of defeats the purpose of the personal touch, doesn''t it?

Fortunately, browsers have a way for you to store and retrieve strings across page reloads: *`localStorage`*. And the way it works is relatively simple. There are only two main methods: `setItem` and `getItem`.

Here''s an example of how we might use those two methods to build a website that remembers your name:

``` {.html}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Cheers</title>
  </head>
  <body>
    <h1 id="greeting"></h1>
    <script>
      // Get the first name from permanent storage (if it exists)
      const firstName = window.localStorage.getItem(''firstName'')

      // If no firstName was previously saved...
      if (firstName === null) {
        // Ask the user for their first name
        firstName = window.prompt(''What is your first name?'')
        
        // If the user clicked "Cancel"...
        if (firstName === null) {
          // Set the first name to "mysterious stranger"
          firstName = ''mysterious stranger''
        // Otherwise, if the user provided a first name...
        } else {
          // Permanently store the user''s first name
          window.localStorage.setItem(''firstName'', firstName)
        }
      }

      // Get the element where we''ll display our greeting
      const greetingElement = document.getElementById(''greeting'')
      // Say hi to the user, including their first name
      greetingElement.textContent = ''Hi, '' + firstName
    </script>
  </body>
</html>
```

Before we dive into that though, [try it out yourself](https://jsfiddle.net/chrisvfritz/f6vnLLaj/).

After providing your name and refreshing, did it ask for your name again? It shouldn''t have. When you told the page your name the first time, it saved your information with `localStorage.setItem`. Then when you refreshed, it ran `localStorage.getItem` to see if it already had a name stored - and it did. So it just displayed it.

### `localStorage.getItem`

`getItem` accepts one argument: 

1. the name of the information we want

It will return either:

* a string, if something has been saved with `localStorage.setItem`, _OR_
* `null`, if the browser hasn''t previously saved a value for `firstName`

### `localStorage.setItem`

`setItem` accepts two arguments:

1. the _name_ of the item we want to save
2. the _value_ we want to store

~~~ {.note}
<p>If it helps, think of <code>setItem</code> as writing to a dictionary. The 1st argument is the word and the 2nd argument its definition. Then with <code>getItem</code>, we retrieve the definition by looking up the word.</p>
~~~

## FAQ

At this point, you may have some questions.
![Kitty has questions](https://i.imgur.com/7n4BFRx.png)

### Where is data stored with `localStorage`?

Instead of saving information on a server somewhere, like many web applications do, data in `localStorage` is stored _locally_ - on the user''s computer, in the browser.

### Can `getItem` access information stored by other websites?

No, it can''t. `localStorage` data is scoped to the domain. That means if your website is at `example.com`, you can only see data saved at pages on `example.com`.

And actually, it''s even more specific than that. Information isn''t even shared across _subdomains_. So data stored by `wary-wilderness.surge.sh` isn''t accessible to `funny-mountain.surge.sh`. 

### How much data can I put in `localStorage`?

Between 2MB and 10MB, [depending on the browser](http://www.html5rocks.com/en/tutorials/offline/quota-research/). If you''re thinking, "2MB doesn''t sound like very much...", it''s probably more than you think when you''re just storing strings.

To get a better idea of how much text is in 2MB, check out [the text file in this ZIP](https://gist.github.com/chrisvfritz/6880d96c100a9a3ad825/archive/a8dbce78fba793fc5254cd3bc1d031d27ec17c6b.zip). It''s exactly 2MB. 2 million random characters. The equivalent to 14,285 full tweets. It''s not _quite_ enough to fit Tolstoy''s famously long _War and Peace_, but you can get most of it. Shave off the boring bits and you''re good. 😜

### How long will `localStorage` data stay on a user''s computer?

`localStorage` data never expires, so it stays on the computer until a user goes into their browser settings and manually clears their entire browser cache or the cache for your website.

### Is `localStorage` like cookies?

It''s similar in that data is stored on the user''s computer, but cookies work somewhat differently and serve a different purpose. You can [read this](http://stackoverflow.com/questions/3220660/local-storage-vs-cookies) if you''re really curious about cookies, but for now, you''re not expected to know anything about them.

## Can I save _anything_ in `localStorage`?

This one gets its own page, because the answer takes a bit more explaining. The good news is, you _can_ save (almost) anything! There''s just one catch. Whatever you save will be turned into a string if it isn''t already one.

That means:

* `0` is saved as `"0"`
* `1` is saved as `"1"`
* `NaN` is saved as `"NaN"`
* `true` is saved as `"true"`
* `false` is saved as `"false"`
* `null` is saved as `"null"`
* `undefined` is saved as `"undefined"`

Starting to get the idea? Everything is _literally_ just wrapped in quotes to turn it into a string.

### Retrieving numbers

Just like when collecting numbers from `input`s and `prompt`s, you''ll have to use `parseInt` or `parseFloat` to turn strings back into a number:

``` {.js}
let quantity = parseInt(window.localStorage.getItem(''quantity''))
```

Note however, that if we''ve never stored a number, so we get back `null`, then `parseInt(null)` will be `NaN` (Not a Number). To avoid this, you can either check for `NaN` with the `isNaN` function:

``` {.js}
let quantity = parseInt(window.localStorage.getItem(''quantity''))

if (isNaN(quantity)) {
  quantity = 0
}
```

Or you can handle `null` specifically before using `parseInt`:

``` {.js}
let quantity = window.localStorage.getItem(''quantity'')

if (quantity === null) {
  quantity = 0
} else {
  quantity = parseInt(quantity)
}
```

### Retrieving booleans

When getting booleans from `localStorage`, you''ll want to check if they''re equal to the _string_ `"true"` to convert them back into a boolean:

``` {.js}
const visitedBefore = window.localStorage.getItem(''visitedBefore'') === ''true''
```

### Handling `null`/`undefined`

Imagine a case like this:

``` {.js}
const firstName = window.prompt(''What is your name?'')
```

Remember that a `prompt` returns `null` if a user clicks the "Cancel" button. So when first name is `null`, what would be stored below?

``` {.js}
window.localStorage.setItem(''firstName'', firstName)
```

When you call:

``` {.js}
window.localStorage.getItem(''firstName'') //=> "null"
```

You''ll get back the string `"null"`. Not `null`, as in nothing, but a string that contains the characters: `"null"`. The same also happens with `undefined`: the string `"undefined"` is saved. 

That''s why in cases where `null` or `undefined` are possible, we recommend explicitly checking for them before using `setItem`:

``` {.js}
if (firstName !== null) {
  window.localStorage.setItem(''firstName'', firstName)
}
```

## Other `localStorage` methods

There are other methods you''ll probably use less often, but will still come in handy in specific situations.

### `localStorage.valueOf()`

Retrieves all the data in `localStorage` for a website. If you''re curious, you can open websites you visit often and run this in the JavaScript console to see if they''re storing anything.

### `localStorage.removeItem(''firstName'')`

Resets the value for the item called `firstName` back to `null`.

### `localStorage.clear()`

Clears _all_ the data in `localStorage` for the current domain.

![The power is yours](https://i.imgur.com/pnaImQJ.png)', NULL, '-KapstpQ2uw6OvwMUDce', 'Build a website that allows the user to switch between day and night color themes and remembers their choice', 'Surge', 2);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (202, 'css-responsive', '🍃 Build websites that look great on any device (including phones)', NULL, '## notes

* `meta name="viewport" content="..."`
* media queries
* behavior of hover on touch devices
* importance of big click areas for touch interfaces
* 300ms delay of click on touch devices (fastclick.js?)', NULL, '-KbR4pY0Ww0qcmwGo9RI', NULL, 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (206, 'html-atom-and-basic-elements', '(OLD) Build a simple webpage using basic HTML elements', 1, '## Installing a code editor

As a human (presumably), you''re super smart. If we make a typo in this sentnce, you''ll keep on reading and maybe not even notice it. Computers though - they hate typos. Sometimes they do all right, but the wrong typo can break everything.

Fortunately, just like there are tools to check spelling and grammar in programs like Microsoft Word, *code editors* have similar tricks to help you write code. In this lesson, we''ll install a code editor called *Atom* and learn how to make it do as much of your work as possible.

~~~ {.note}
If you already have another text editor installed, like VS Code or Sublime Text, feel free to keep using that instead.
~~~

Head over to [atom.io](https://atom.io/). Now click on the _Download_ button. When you''re done installing, start the project for this lesson, clone the GitHub repo to your projects folder, then open up Atom.

The first thing you''ll probably notice is that unlike most programs, Atom is full of dark backgrounds with light-colored text.

![Atom at startup](https://i.imgur.com/I4rET0n.png)

When you''re spending a lot of time squinting at code, you''ll appreciate this, as the dark backgrounds are easier on the eyes!

You''ll also notice a lot of different buttons, but don''t worry about them for now. Just click on `File` ->  `Add Project Folder` and open the directory for the project you just cloned.

![Adding a project folder in Atom](https://i.imgur.com/IULkV93.png)

Once that''s done, you should see a new sidebar on the left with the name of the directory at the top, similar to:

![Folder with empty sidebar in Atom](https://i.imgur.com/HZR78nz.png)

Once again, we''re going to create an `index.html` file, but this time in Atom. Right-click on your project directory, click on `New File`, type `index.html` into the box that pops up, then press enter.

![Creating a new file in Atom](https://i.imgur.com/Q3tdyso.png)

![Naming the new file in Atom](https://i.imgur.com/y9YHzhh.png)

Excellent! Now, it''s time to create a _slightly_ more sophisticated website.

## The basics of HTML (`strong`, `em`)

Let''s add a little pizzaz to our `index.html` file:

``` {.html}
This is a <strong>great</strong> website!
```

~~~ {.note}
In Atom, you may notice that the code isn''t just a single color. This is a feature called *syntax highlighting*. Since every character is important, these different colors help you more easily skim code and notice when something is out of place.

*Pay attention to these colors!* If you make a typo and remove a vital character, you''ll often notice they change drastically:

``` {.html}
This is a <strong great</strong> website!
```

This can be a great hint that something is wrong. 
~~~

Now try opening the file in your browser. In Atom, you can right-click on the file, then on:

* `Show in Finder` (macOS)
* `Show in Explorer` (Windows)
* `Show in File Manager` (Ubuntu)

Then just as in the previous lesson, double click on the file to open it in your browser.

You should now see your website, with the word `great`  bolded:

~~~ {.result}
This is a <strong>great</strong> website!
~~~

That''s because the `strong` element indicates text of _strong importance_, which means by default in most browsers, it''s bolded. Notice that `<strong>` and `</strong>` _do not_ appear on the page -- they simply affect whatever''s in between them.

You may also notice a tiny difference between the first and second `strong`:

``` {.html}
<strong>
  great
</strong>
```

Do you see it? Each of these two parts is called a *tag* and:

* the 1st one -- the *starting tag* -- starts with `<`
* the 2nd one -- the *closing tag* -- starts with `</`

Together, they form an *element* and anything in between the two is the *content* of that element.

Another element that goes very nicely with `strong` is `em`:

``` {.html}
Those kitties are <em>sooo</em> cute.
```

It''s very similar to `strong`, indicating that the content should be _emphasized_, adding italics by default in most browsers:

~~~ {.result}
Those kitties are <em>sooo</em> cute.
~~~

There are many different HTML elements and we won''t teach you all of them in this lesson, but in the following pages, we''ll walk through some very common ones and teach you a little bit more about the nuances along the way.

## Inline vs block elements (`p`, `h1`-`h6`)

Now if you''ve done some experimenting, you may have noticed that:

``` {.html}
Multiple
lines
are
collapsed
into
one
line
in
HTML.
```
~~~ {.result}
Multiple
lines
are
collapsed
into
one
line
in
HTML.
~~~

``` {.html}
And even
<strong>
  strong
</strong>
or
<em>
  em
</em>
elements are collapsed.
```
~~~ {.result}
And even
<strong>
  strong
</strong>
or
<em>
  em
</em>
elements are collapsed.
~~~

So how do you actually create multiple lines, for example to separate paragraphs? That''s where *block* elements come in. One of the most common block elements is the *paragraph* element (`p`):

``` {.html}
<p>This is a paragraph.</p>
<p>Here''s another paragraph.</p>
```
~~~ {.result}
<p>This is a paragraph.</p>
<p>Here''s another paragraph.</p>
~~~

This works because block elements appear on top of each other, as opposed to inline elements (and text), which appear side-by-side.

The 6 *heading* elements are also very common. Ranging from highest to lowest importance, they include:

``` {.html}
<h1>Hello</h1>
<h2>Hello</h2>
<h3>Hello</h3>
<h4>Hello</h4>
<h5>Hello</h5>
<h6>Hello</h6>
```
~~~ {.result.headings-example}
<h1>Hello</h1>
<div class="h2">Hello</div>
<h3>Hello</h3>
<h4>Hello</h4>
<h5>Hello</h5>
<h6>Hello</h6>
~~~

## Nested elements (`ol`, `ul`, `li`)

Elements can also go inside of each other. For example:

``` {.html}
<h4>Pronouncing rhinoceros</h4>
<p>
  In the word <strong>rhinoceros</strong>, 
  the emphasis should be on the second syllable, like   
  <strong>
    rhi<em>no</em>ceros
  </strong>.
</p>
```
~~~ {.result}
<div class="flex-col">
<h4>Pronouncing rhinoceros</h4>
<p>
  In the word <strong>rhinoceros</strong>, 
  the emphasis should be on the second syllable, like   
  <strong>rhi<em>no</em>ceros</strong>.
</p>
</div>
~~~

There are a bunch of elements inside the `p` element -- and even within that, there''s an `em` inside of a `strong`! This is called *nesting* elements, similar to how Matryoshka dolls can be nested inside of each other: 

![Matryoshka dolls](https://i.imgur.com/OU0uYm5.jpg)

Some elements are _always_ nested inside of other elements. One such example is the *list item* element (`li`). It can be either inside of an *ordered list* (`ol`):

``` {.html}
<ol>
  <li>ordered</li>
  <li>list</li>
  <li>items</li>
</ol>
```
~~~ {.result}
<ol>
  <li>ordered</li>
  <li>list</li>
  <li>items</li>
</ol>
~~~

Or an *_un_ordered list* (`ul`):

``` {.html}
<ul>
  <li>unordered</li>
  <li>list</li>
  <li>items</li>
</ul>
```
~~~ {.result}
<ul>
  <li>unordered</li>
  <li>list</li>
  <li>items</li>
</ul>
~~~

But it must always be in one of those two. Conversely, `ul` and `ol` elements may _only_ contain `li` elements, though those `li` elements may include any other elements.

## Elements with attributes (`a`)

Elements can also include *attributes* in the opening tag. Attributes attach extra information to the element that can change its behavior. One example of an element that will almost always have attributes is the *anchor* element (`a`), which is used for links:

``` {.html}
Here''s a link to
<a href="https://google.com/" target="_blank">Google</a>.
```
~~~ {.result}
Here''s a link to
<a href="https://google.com/" target="_blank">Google</a>.
~~~

There are two attributes here: `href` and `target`, with *values* of `https://google.com/` and `_blank`, respectively. 

The name `href` might sound pretty strange, but you might be able to guess what it does. It tells the browser where to send the user if they click on the link. It stands for _hyperlink reference_.

By default, links open in the same tab, but with `target="_blank"`, the link will open in a new tab.

## Self-closing elements (`img`)

There are also elements that don''t have a closing tag, because they can never have content. One example is the *image* element:

``` {.html}
<img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
```
~~~ {.result}
<img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
~~~

The `img` element also has two _required_ attributes: 

* `src`: the source URL for the image
* `alt`: what text should appear if the image can''t load for some reason

If the browser couldn''t download the image above, you''d see this instead:

~~~ {.result}
<img src="_" alt="Cat picture">
~~~

### Making images clickable

It''s also common practice to wrap an `img` in an `a`, so that users can click on the image to be taken to a full-sized version:

``` {.html}
<a href="https://i.imgur.com/hmcq8n6.jpg" target="_blank">
  <img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
</a>
```
~~~ {.result}
<a href="https://i.imgur.com/hmcq8n6.jpg" target="_blank">
  <img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
</a>
~~~

The image might not look any different, but if you put your mouse over it, the cursor should change. If you click on it, you''ll now be able to count that kitty''s whiskers.

### Finding images for your websites

If you have images on your computer that you want to share online, you can actually place them in the same directory as your `index.html` file, then use the filename as the value of the `src` attribute:

``` {.html}
<img src="fluffles-the-turtle.jpg" alt="Fluffles is super pumped for the rave he''s been planning">
```

If you''d like to use an image you find online, it can be slightly more complicated. You have to make sure you:

1. have *legal permission* to use the image
2. are *hosting* the image yourself or from another consenting source
3. have provided *attribution* for the image, if necessary

To make sure you have legal permission to use an image, you have two options: 

1. Contact the owner to confirm your proposed usage is appropriate. You might need to pay to use the image. 
2. Only use images that you know are in the public domain or royalty-free. 

We recommend the 2nd option. It''s easier. Some great sources for images like this include:

* [Pixabay](https://pixabay.com/)
* [Wikimedia Commons](https://commons.wikimedia.org/w/index.php?search=&title=Special%3ASearch&go=Go&uselang=en)

Once you find an image you like, you''ll have to download it. You can do this by right-clicking on it in your web browser, then clicking on `Save Image As...` (or similar, depending on the browser you''re using). Give it a descriptive name and save it in your project directory. Now you can use it in your webpage, just as described earlier.

If the page with the image mentions that its license requires *attribution*, that means you have to include where the image came from. Sometimes, attribution just means link back to the source and sometimes it''s preferred to place a note right below the image. If it''s not specified in the license, we prefer the latter.

## What _is_ HTML? What can it do?

You''ve now created two files ending with `.html` and have heard that they''re a foundation of web development, but... what exactly _is_ *HTML*? Well, it''s short for *HyperText Markup Language*, but that still doesn''t tell us very much, so let''s take a step back and look at it in context. 

It''s actaully just one of three languages that web browsers speak. Each of these languages has a specific job (though there is some overlap) and HTML''s job is to help you define the *content* and *structure* of the page. In other words, what will appear and how will it be organized?

That''s a big responsibility, but there''s a lot that''s not covered there.

### What HTML _can''t_ do

Generally speaking, it''s not possible to control the *design* of the page purely with HTML (i.e. _how_ it looks). For example, if you want a 2-column layout, links to be green, paragraphs to be farther apart, or you want to use a different font for headings, you''ll need another language called *CSS*.

It''s also not generally possible to control *complex interactions* just with HTML (at least not without refreshing the page). Examples include like/retweet buttons, interactive charts, information that updates automatically (like the project statuses on this website) -- all of these require another language called *JavaScript*.

You''ll learn more about these other languages soon, but for now...

![Patience, you must have](https://i.imgur.com/wj51FJk.jpg)

### Working on the project

The website you''ll build for this lesson will have well-structured information, but it won''t be pretty or have any cool animations. To give you a better idea of what to expect, removing any CSS or JavaScript from an older version of this lesson looked like this:

![This lesson with plain HTML](https://i.imgur.com/zirk84K.png)

It''s still pretty readable, just a little plain-looking. That means in our project, we''ll have to compensate by making the content funny and charming.

![Fly, be free](https://i.imgur.com/RN26BYO.jpg)

Cat pictures help. We hope. 😅', NULL, '-K_m88HN5RWspKJmL5o8', 'Build a résumé for a fictional character, applying for a fake (and ideally ridiculous) job', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (211, 'html-semantic-elements', 'Use semantic HTML elements to improve SEO and accessibility', 1, '## What are Semantics?

What do you make of this cloud of random letters?

![Non-word cloud](http://i.imgur.com/mDSg0DW.png)

At first glance, it''s gibberish. But if you look long enough, you might find something pronounceable that _could_ be a word&mdash;isn''t "yarf" the sound a dog makes when it yawns? You might even see a real abbreviation like "CIO" or "GMO".

Your brain _wants_ to make sense of information. But putting letters into words isn''t enough. Consider this word cloud:

![Word cloud](http://i.imgur.com/WoMf2XS.jpg)

Instead of a bunch of letters, you can see a bunch of words. You know what those words mean, but the way the words are organized doesn''t tell you anything other than "here''s a bunch of words."

What if those same words were formed into complete sentences?

![Quote cloud](http://i.imgur.com/xyR7H1h.jpg)

Now _this_ we can understand. 💫

As it turns out, if you organize words in the right way, you can share some very meaningful ideas!

### Syntax vs. semantics

In language, _how_ you organize words and ideas is known as *syntax*. The _meaning_ of those words and ideas is called *semantics*.

Consider this example:

``` {.txt}
I love cats
👁️ ❤️️ 🐈
私は猫が大好き
```

Each line _means_ the same thing, but _how_ we type them is different. The syntax changed, but the semantics did not. Using a different language or replacing words with emoji are a couple of ways to use different syntax.

It''s also possible to change the meaning of what you say without changing the words. Check this out:

``` {.txt}
Aren''t you happy!
Aren''t you happy?
```

By simply replacing the exclamation with a question mark, the meaning of the sentence changed from excitement to one of concern.

In written or typed languages, we can use punctuation, *bold letters*, _italics_, ALL CAPS, and other text decorations to change the meaning of what we say. When we''re talking, we use the inflection of our voice and body language.

Semantics are important for us to understand each other properly. If we say the right words in the wrong way, it can be confusing, get us in trouble, or make us seem creepy.

![Romantic vs creepy message](https://i.imgur.com/i79Ho0o.jpg)

## Semantics on the web

Semantics also play an important role on the web, and not only because people need to understand what they''re looking at. Computers need to understand your web pages, too!

### Search engines

Search engines are always on the lookout for new content to add to their results. When they find a new page, they dissect the HTML, index and categorize all of the content, and follow links to other pages.

Let''s say you run a fan fiction site for your favorite cartoons and you have two new articles on your main page:

``` {.html}
<body>
  <h2>Now Shipping: Rainbow Dash and Fluttershy</h2>
  <p>It was a dark and lonely night...</p>

  <h2>The Secret Origin of Princess Bubblegum</h2>
  <p>Many years before the Mushroom War...</p>
</body>
```

How does Google know these are two different articles? Search engines are pretty good at guessing, but your site will still probably show up lower for "adventure time fanfic" than for "my little pony adventure time fanfic."

People looking for a _My Little Pony &amp; Adventure Time_ mash-up are going to be pretty disappointed when they visit your site expecting this:

![My Little Pony meets Adventure Time](http://i.imgur.com/RfQV3YX.png)

Okay, maybe this needs to be a thing. But it''s not your thing!

You and Google both want to make sure that when people visit your site, they get what they''re looking for. In fact, Google cares so much about it that they made it their mission:

<blockquote>
  To organize the world’s information and make it universally accessible and useful.
</blockquote>

But Google can only do so much. Ultimately, the site is yours and that means if you want it to appear high up in search results, you have to help search engines by doing some *search engine optimization*.

~~~ {.note}
*Search engine optimization (SEO)* is a collection of techniques used to improve a website''s placement in relevant search engine results.

Some of these techniques include increasing the number of links to your content on other websites, making your website mobile-friendly, and even using newer HTML elements that help them better understand your content.
~~~

### Screen readers

The National Federation of the Blind estimates that there are over 7 million people in the United States who are blind or visually impaired. Beyond that, there are 32-47 million people who are illiterate or have a learning disability.

One way these groups of people can access the Internet is by using a type of software called *screen readers*. Screen readers convert text on the device screen to speech or Braille.

Screen readers rely heavily on well-structured HTML to work effectively. Using the elements in this lesson can help make your web pages accessible to millions more people! 🌎

### Semantic HTML Elements

When you write HTML, there is a specific way you have to type tags so that your web browser can display a page properly:

``` {.html}
<a href="/">Stupendous Content</a>
```

All HTML tags have a name surrounded by angle brackets (`<>`). Sometimes tags have attributes. A `/` indicates the close of a tag. That is HTML''s *_syntax_*.

The _name_ of a tag gives it meaning. `a`, for example, means the element is an anchor (i.e. link) to somewhere else. A *semantic HTML element* is an element whose name tells you something meaningful about the element''s content.

All tags have names, but only some are considered semantic HTML elements. That''s because some tags, such as `div` and `span`, don''t tell you anything about their content.

Over the next pages, we''ll take a closer look at nine of the newest semantic elements that are useful for organizing your content and optimizing for search engines:

* `main`
* `article`
* `header`
* `section`
* `figure`
* `figcaption`
* `aside`
* `footer`
* `nav`

## A recipe for semantic HTML

One of the nice things about semantic HTML elements is that their names pretty much describe what they do -- and even give you a clue about where they belong.

Take a look at this recipe. You might be able to guess which parts make up the `header`, `footer`, `figure`, `aside`, `nav`, or various `section` elements.

![Recipe with CSS](http://i.imgur.com/ZMLRwxa.jpg)

For the remainder of this lesson, we''ll demonstrate how to use each of the semantic HTML elements using this recipe. Semantic elements aren''t limited to recipes though. They can just as easily be used for blog posts, product reviews, stories, and so much more!

~~~ {.warning}
#### Semantic elements are _not_ styled

You may have noticed that our sample recipe has an extra big title, a blue box beneath the intro, two columns for the ingredients and directions, a yellow recommendation, and thumbnail links to other recipes (to name a few).

Here''s what the recipe looks like without any added styles:
![Recipe without CSS](http://i.imgur.com/J0CZhgI.jpg)
Semantic HTML elements do not come with any styles. What''s more, they don''t even have _opinions_ on how your content should look. That''s totally up to you!
~~~

Now, let''s explore these elements in more depth, starting with the `main` element.

### The `main` element

This element literally means _the main content_ of the page. There should only be one of them inside your `body` element, because your page should have only one main purpose.

If the purpose of your page is to list links and short content for a bunch of blog posts, it should all go inside a `main` element. If your page is a single blog post, the whole post&mdash;title and all&mdash;should go inside `main`.

But doesn''t that mean `main` is basically the same thing as `body`? Nope!

There are things that _shouldn''t_ go in your `main` element: logos, copyright information, your site''s navigation, sidebars, and anything else that will exist on every page of your website.

~~~ {.note}
Search engines create relationships between different content on your site to help people find relevant information.

If you have an "About Me" link on every page, don''t put it in `main`. If you make Google think there''s a strong relationship to your "About Me" page, it could start appearing higher in search results than more important content you care about, like your products or blog posts! 😱
~~~

## The anatomy of an article

On the web, an *article* is any content that can be read, start to finish, entirely independently of any other content. This includes:

* recipes
* tutorials
* blog posts
* short stories
* product reviews
* news... articles 😉

Articles typically have a title followed by one or more blocks of related content, as well as extra information about the piece such as the author and date. Article content is also often broken up into sections or lists to make it easier to read.

Look at [any](https://medium.com/@zackkelly/5-life-changing-things-i-learned-from-doing-improv-e398342238e7#.nf9n9sn04) [random](https://artplusmarketing.com/12-haikus-26d0acd8fcb4#.3r1z8bw6o) [article](https://medium.com/@sheamatthewfisher/macbeth-in-klingon-35e88cf50479#.o49f5mxo6) on Medium and you''ll see that same basic structure. 

### `article`

The `article` element wraps all of the content, title and all. The idea behind an `article` is that you can take everything inside it, give it to someone else, and they''ll still be able to understand it.

Putting a whole recipe inside an `article` makes sense. If you only put the ingredients in an `article` though, the reader won''t be able to prepare the meal, because they won''t have the directions!

Both semantic tags (described below) and non-semantic tags like `div` and `span` can go inside an `article`. You can also have as many `article` elements on a page as you want.

~~~ {.note}
Much like search engines downplay relationships between your `main` content and everything else on the page, they don''t consider the content in two `article` elements on the same page to be strongly related.
~~~

### `header`

If your content has a title, author name, or featured image, `header` is a good place to put them.

``` {.html}
<header>
  <h1>Tex-Mex Goulash</h1>
</header>
```
~~~ {.result}
![Recipe header](http://i.imgur.com/bTDu9BL.jpg)
~~~

Typically `header` will be one of the first elements inside your `article`, but `header` elements aren''t just used for articles. You can use `header` elements in `body`, `main`, or anywhere else that needs a title or introductory content and you can use as many as you want.

~~~ {.note}
The `header` element doesn''t play a strong role in SEO, but screen readers can use the `header` to remind users about the content they are reading or listening to.
~~~

### `section`

A `section` defines a portion of your content that has a theme or topic of its own, but isn''t otherwise useful without the surrounding content. Like a chapter in a book, or the list of ingredients for a recipe.

``` {.html}
<section class="ingredients">
  <h2>Ingredients</h2>
  <ul>
    <li>1 lb. hamburger</li>
    <li>1 lb. corn macaroni</li>
    <li>1 medium red onion, chopped</li>
    <li>1 red bell pepper, chopped</li>
    <li>1 poblano pepper, chopped</li>
    <li>1 large tomato, seeds removed, chopped</li>
    <li>1 can (4 oz.) diced jalapeños, drained</li>
    <li>1 can spicy Mexican tomato sauce</li>
    <li>2-3 tbsp. taco seasoning</li>
  </ul>
</section>
```
~~~ {.result}
![Recipe ingredients section](http://i.imgur.com/7yDCKVD.jpg)
~~~

The `section` element is fairly generic. You don''t have to put them inside `article` elements; they can go anywhere inside the `body` that makes sense to you, even inside other `section` elements. You can also use them inside an `article` to break up your content.

A good rule here is to avoid using a `section` when something more specific will work.

~~~ {.note}
Search engines are far more interested in your content as a whole (e.g. everything in `main` and each `article`) than content in each `section`.

The `section` element _is_ useful to screen readers, though. Each `section` can be used as a landmark to help people who are visually impaired, can''t read, or have a learning disability navigate your content.
~~~

### `footer`

The `footer` element is similar to `header`: it can be used inside an `article` or outside of one. It''s used to hold any information that you would like readers to see at the end of your content.

``` {.html}
<footer>
  Original recipe by Erik Gillespie
</footer>
```
~~~ {.result}
![Recipe footer](http://i.imgur.com/ruguycc.jpg)
~~~

The `footer` might include related articles, info about the author, copyright information, or navigation buttons (e.g. to the next or previous recipe).

~~~ {.note}
The `footer` element, much like `header`, is more important for screen readers than it is for SEO. But while `header` elements are used for navigation, the `footer` is often announced&mdash;literally&mdash;as "Content Information."
~~~

## Navigating and flavoring content

So far we''ve covered a lot of tags that are great for organizing your content, but a quick look at any newspaper, magazine, or text book will reveal that there''s more to an article than a bunch of well-organized paragraphs and headings.

![Kitty needs variety](http://i.imgur.com/Ar5Eaaf.png)

The rest of the semantic elements in this lesson are used to add variety and a consistent way for readers to explore your content.

### `figure` and `figcaption`

Magazines, newspapers, books, and web pages are full of figures with captions. Some of the common figures you''ll come across are pictures, code snippets, and graphs. And the caption &mdash; the label underneath a figure &mdash; is usually a brief remark about the figure.

A `figure` should relate to the nearby content, but its position on the page should not. That''s because some tools, like screen readers, don''t always consider your page styles. Remember, semantics has nothing to do with appearance!

``` {.html}
<figure>
  <img src="goulash.jpg" alt="Tex-Mex goulash">
  <figcaption>
    Is it Hungarian? Is it Mexican? Who cares!
  </figcaption>
</figure>
```
~~~ {.result}
![Recipe figure](http://i.imgur.com/jfJkAu8.jpg)
~~~

The `figure` element can be sprinkled into your content wherever you find appropriate. `figcaption`, on the other hand, should always be the first or last element inside of a `figure`.

Anything else that goes inside a `figure` is up to you! In a previous lesson you learned how to add tables, video, audio, and embedded content from places like YouTube. Those are all good fits.

And, of course, images. 😛

`figure` is the only element in this lesson that has any styles applied to it by default (there''s a small margin around it that makes it look indented in some browsers).

~~~ {.note}
Search engines also help people find images. They love using the `figcaption` as a source of keywords for a `figure`. Using thoughtful captions is a great alternative way for people to find your site!
~~~

### `aside`

An aside is some information &mdash; usually words &mdash; that is somewhat related to the content around it, but isn''t _part_ of that content. In a conversation, you might start an aside with "by the way...." An `aside` on a webpage can be a quote, some words of caution about a topic, a deeper dive into a subject, or even a slight detour from the main content.

``` {.html}
<aside>
  <h4>Try this instead!</h4>
  <p>
    Substitute the burger with black beans for a high-fiber,
    gluten free vegan adventure!
  </p>
</aside>
```
~~~ {.result}
![Recipe aside](http://i.imgur.com/OwIiuyt.jpg)
~~~

Asides are usually brief, but they don''t have to be! You can put a whole mini-article inside of one if you want. That means inside an `aside` element, you can use all sorts of other elements like `h2`, `p`, and `blockquote`.

Like figures, asides should not be required reading. They simply add variety and improve the overall quality of your content.

~~~ {.note}
Search engines don''t give `aside` elements special treatment, but screen readers do! Like `section` elements, `aside` elements can be used to help someone jump around your content.

Screen readers will also announce the beginning and end of an `aside` so the user knows the content is complementary to the rest of the article.
~~~

### `nav`

It''s pretty rare to find a page on the web that doesn''t have navigation links _somewhere_ on the page. Usually they''re hanging out at the very top, in a sidebar, or in a menu somewhere. Wherever they are, a `nav` element can be used to group them all together.

Besides providing an easy way for readers to move from page to page on your site, the location of a `nav` element can also help people understand where links will take them.

``` {.html}
<section class="related-recipes">
  <h2>More recipes for you</h2>
  <nav>
    <ul>
      <li>
        <a href="#">
          Mexican Pizza
          <img src="pizza.jpg" class="recipe-thumbnail" alt="Mexican pizza">
        </a>
      </li>
      <li>
        <a href="#">
          Spaghetti Tacos
          <img src="tacos.jpg" class="recipe-thumbnail" alt="spaghetti tacos">
        </a>
      </li>
      <li>
        <a href="#">
          Taco Lasagna
          <img src="lasagna.jpg" class="recipe-thumbnail" alt="taco lasagna">
        </a>
      </li>
    </ul>
  </nav>
</section>
```
~~~ {.result}
![Recipe navigation](http://i.imgur.com/OJSl4j2.jpg)
~~~

For example, putting the same `nav` element at the top of every page helps readers find the most important pages on your site, like "Home" or "About" pages. If you put a `nav` element in a `header`, `footer`, or `section` of an article, the links are usually to other articles or related information.

~~~ {.note}
Search engines &nbsp;  ❤️️ &nbsp; links. If you put a `nav` with links inside an `article`, search engines will consider those links way more relevant than links outside of your `article`.

That''s one reason many sites include "Related Posts" with an article: easy SEO.
~~~

Bon appétit! 🍲

', NULL, '-KapkxyCZi9NbI5BSgA-', 'Create a "Products" page for a fake online store', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (215, 'js-docker-intro', '☀️ Use docker to manage and deploy server apps anywhere', NULL, '## notes

* docker
* docker compose
* docker build', NULL, '-KapuO5WrH5TsxfXDOsA', NULL, 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (216, 'js-functions', '☀️ Advanced functions for fun and profit (working title)', NULL, '## using functions for de-duplication



* take common things and make them arguments

``` {.js}
if (hi) {
} else {
}
```

~~~ {.note}
good names for functions vs other variables
~~~

## combining similar stuff in variables or functions

``` {.js}
greetingElement.textContent = ''Hi, '' + firstName + '' '' + lastName
profileLinkElement.textContent = firstName + '' '' + lastName
```

## returning values from functions

``` {.js}
var firstName = ''Chris''
var lastName = ''Fritz''

var getFullName = function (firstName, lastName) {
  return firstName + '' '' + lastName
}
```

Nothing happens after return!

functions are easiest to reason about when they have no "side-effects"

Using return to end a function early

---
---
---

## different ways of defining functions

var test = function () {
}

the difference is that `var functionOne =` is a function expression and so only defined when that line is reached, whereas `function functionTwo` is a function declaration

in function declaration, none of this:

if (test) {
  // Error or misbehavior
  function functionThree() { doSomething(); }
}

## function-level scope

Functions control scope
what happens if you don''t use var?
dangers of global scope (e.g. `var name`)

## nested functions

closures, factory functions

## using functions for loops

arst

## State changes over time

simple example where input event changes value of variable, but 

PROJECT:

state (single source of truth)
event listeners
update DOM
helpers', NULL, '-Kbcb4kfNFyVQYHTH086', NULL, 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (217, 'js-intro', 'Use JavaScript to build more interactive webpages', 2, '## What is JavaScript?

JavaScript is the programming language of the web. It runs in every modern browser and pretty much anywhere else -- including servers, phones, and watches. You can actually try it out right now. First, download and install the [Google Chrome](https://chrome.google.com) web browser, if you don''t have it already. Once installed, go to any page and press `Cmd`+`Opt`+`J` (Mac) or `Ctrl`+`Shift`+`J` (Windows / Linux).

The little box that just opened is the browser''s *JavaScript console*:

![Browser console](https://i.imgur.com/dMGtiBH.png)

Now click inside of that box try typing in:

``` {.js}
alert(''Blarg'')
```

Then press `Enter`. Did you see a box pop up with the message `Blarg`? Then congratulations! You just ran some JavaScript. &nbsp;🎉

~~~ {.note}
### JavaScript vs Java

Java is the name of another programming language. Many people become confused by the fact that JavaScript and Java sound so similar. Here are the answers to some common questions:

*So is JavaScript like a special kind of Java?*

Java is to JavaScript what Car is to Carpet. In other words, no relation at all.

*Then why is Java in the name?*

Short answer: marketing. Here''s the [long answer](http://en.wikipedia.org/wiki/JavaScript#History), if you''re interested.
~~~

## Where does JavaScript go?

The browser''s JavaScript console is incredibly useful for trying out commands, but to make your page come with its _own_ JavaScript, you have to include it with a `script` element:

``` {.html}
<script>
  alert(''Welcome to my website!'')
</script>
```

Unlike `style` and `link`, which are used for CSS, the `script` element _usually_ goes at the end of the `body` element, right before the closing `</body>` tag:

``` {.html}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>A webpage with JavaScript!</title>
  </head>
  <body>
    ... BODY CONTENT ...
    
    <script>
      alert(''Welcome to my website!'')
    </script>
  </body>
</html>
```

Now try including that `script` element in one of your previous projects, then opening it in the browser. As soon as the page loads, your JavaScript should run, displaying the alert box.

### Including JavaScript from a file

You can also include JavaScript from a file that ends with `.js`. This has the advantage of keeping your HTML clean and allows you to share JavaScript between pages.

Instead of placing your JavaScript code in between your `script` tags, you''ll add a `src` attribute, linking to your JavaScript file in the same way you''d link to an image or CSS file.

``` {.html}
<script src="script.js"></script>
```

Put your `script` element directly before the closing `</body>` tag in your HTML file so your JavaScript runs _after_ the page loads.

### Play as you go

Learning JavaScript can be a little more difficult than HTML or CSS, but here''s the trick: practice and experiment. As you learn more, *keep an old project open so you can play around*. Paste in the code you see, then watch what it does in your browser to test your understanding. You can even try to modify it and watch to make sure it does what you thought it would do.

Unlike some other environments, working with JavaScript in the browser is actually very safe. You can''t accidentally delete files or send 1,000 emails by mistyping a command. The absolute worst that can happen is you get caught in an infinite loop that crashes your browser. In those cases, you can just delete the bad code, save, then open your browser again. It''ll be fine. 🙂

## Doing things in JavaScript

If you closed the JavaScript console, open it up again and enter:

``` {.js}
2 + 2
```

The result, as you could have probably guessed, is `4`. 

This is the kind of thing people often think of when they imagine programming. Math stuff. Sure, there''s some of that, but most programming actually revolves around more _human_ information, like using the `alert` you saw earlier:

``` {.js}
alert(''Game over! Ready to play again?'')
```

We''ll be playing with a little more simple math in upcoming examples though, because it can still be quite useful for learning the basic tools that JavaScript offers you.

In the examples above, you saw two examples of *types* of things we can work with in JavaScript: `Number` and `String`.

### `Number`

In JavaScript, numbers can be whole numbers, like `1`, `2`, and `3`. They can also be decimals, such as `3.14`. If you want to make a really big number, like 1,000,000, you won''t use commas (or dots/spaces, as in some languages). You''ll just write the number without any punctuation: `1000000`. 

You also saw us add numbers together with `+`. This is called an *operator*. Some of the common operators in JavaScript include:

* `+` for addition
* `-` for substraction
* `*` for multiplication
* `/` for division

Can you guess what this will return?

``` {.js}
2 * 15 / 6 - 5
```

How about?

``` {.js}
3 + 7 * 0.5 / 2
```

Try them out in the console!

### `String`

Strings are series of *characters* (i.e. text). These are examples of characters:

* `A`
* `b`
* `0`
* `1`
* `$`
* `.`
* ` ` (a space)

So a string is a collection of them, like this:

``` {.js}
''Why did the chicken cross the road?''
```

Above, we''ve surrounded the characters with *single quotes* (also called _apostrophes_ in other contexts). They can also be surrounded with *double quotes*:

``` {.js}
"Why did the chicken cross the road?"
```

But what if you want want to include an apostrophe _in_ a string surrounded with single quotes, like below?

``` {.js}
''Why''d the chicken cross the road?''
```

Uh oh, you can see that the syntax highlighting suddenly changed drastically, which is usually a sign that something is wrong. JavaScript now thinks the apostrophe in `Why''d` signals the end of the string. 😬

To fix this, you can *escape* the apostrophe (and any other problematic characters), just like you escape spaces in the terminal, with a backslash (`\\`):

``` {.js}
''Why\\''d the chicken cross the road?''
```

~~~ {.note}
#### Remembering backslash vs forward slash

It can be difficult to remember the difference between a backslash (`\\`) and a forward slash (`/`). Fortunately, if you grew up with a language that reads left-to-right, there''s a trick that might be helpful. 

If you imagine that gravity were suddenly applied to these slashes, which way would they fall? The backslash would fall _back_ (to the left) and the forward slash would fall _forward_ (to the right).
~~~

## Telling JavaScript to remember things

Let''s say you''re calculating a tip at a restaurant. You might start by adding up the prices of all the things you bought, leaving out what your friends bought:

``` {.js}
2.49 + 6.99 + 1.99 + 3.49
```

That gives you:

``` {.output}
14.96
```

But here''s the thing. You don''t want to have to remember that number. Plus, when you''re writing a program for a website, you can''t be there in everyone''s browser helping the program along by remembering things for it. It''s time to remove JavaScript''s training wheels and make it remember things on its own with *variables*.

To *declare* a new variable, you need to know two things about it:

1. Will the variable ever change?
2. What is the variable''s name?

After you answer these two questions, you can *declare* your variable. That is, you can create the variable in JavaScript.

If the variable won''t ever change, use the `const` keyword to declare it:

``` {.js}
const total = 2.49 + 6.99 + 1.99 + 3.49
```

If the variable will change, then use the `let` keyword to declare it:

``` {.js}
let total = 2.49 + 6.99 + 1.99 + 3.49
```

In both examples, a new variable called `total` is declared and the result of `2.49 + 6.99 + 1.99 + 3.49` is stored inside it. The equal sign (`=`) is the *assignment operator*. It basically just means, "JavaScript, remember this thing!"

If you use the `const` keyword to declare a variable, you can only use the assignment operator (`=`) on the variable once. If you try to assign a new value to a `const` variable, you will get an error.

![Error assigning to const variable](https://i.imgur.com/S46arCu.png)

When using `let` to declare a variable though, you can change its avlue all day long. For example, let''s say your friend said they''d actually cover your basket of fries for $2.49, because really, they ate most of them anyway.

``` {.js}
let total = 2.49 + 6.99 + 1.99 + 3.49
total = total - 2.49
```
``` {.output}
12.47
```

Notice we didn''t include the `let` keyword again. We only needed that for declaring a _new_ variable. Now that JavaScript knows about `total`, we can just type its name whenever we want to use it, even when assigning it a new value.

Also note that JavaScript has now forgotten about the old value of `total`. That `14.96` is gone forever and it remembers only `12.47`.

Finally, let''s add a 20% tip to total:

``` {.js}
total = total + total * 0.2
```
``` {.output}
14.964
```

Also, we didn''t bring any coins, so let''s round that value to the nearest dollar using JavaScript''s `Math.round`:

``` {.js}
total = Math.round(total)
```
``` {.output}
15
```

And there''s what you pay!

If you were making a real tip calculator for other people, the users would have to provide prices for items themselves and you''d also store those in variables. However, we won''t be learning about collecting information from users until a later lesson.

~~~ {.note}
#### What about `var`

You may also see people use the `var` keyword to declare variables:

``` {.js}
var total = 2.49 + 6.99 + 1.99 + 3.49
```

`var` is the original way to declare a variable in JavaScript and it behaves a lot like `let`, but has some subtle and potentially confusing differences. For example, you can use a `var` variable _before_ it''s even declared.

It''s good to know that `var` exists, but avoid using it as much as you can.
~~~

## Telling JavaScript to remember _how to do things_

Of course, numbers aren''t the only thing that can be stored in variables. _Anything_ can be stored, including the strings we just learned about:

``` {.js}
const joke = ''Why did the chicken cross the road?''
```

Next though, we''re going to store a new type that opens a whole world of possibilities: a *function*. For our first function, we''ll teach Javascript how to tell jokes:

``` {.js}
let tellJoke = function () {
  const joke = ''Why did the chicken cross the road?''
  const punchline = ''To get to the other side.''
  
  alert(joke)
  alert(punchline)
}
```

~~~ {.note}
When you saw `tellJoke`, you may have been surprised that it wasn''t written `tell-joke`, since both HTML and CSS prefer to write in all lowercase, with dashes separating words.

Since `-` is an operator for subtraction in JavaScript, there''s a different convention for names with multiple words: *camelCase*. That means we begin with lowercase, then each word after the first word starts with a capital letter, like the `J` in `tellJoke`. The capital letters are taller, like humps on a camel - get it? 🐫
~~~

If you copy and paste those lines into your console, it won''t appear to actually do anything. Once you''ve told JavaScript to remember a function, you have to _call_ that function for it to run. To call `tellJoke`, we can enter its name with parentheses after it:

``` {.js}
tellJoke()
```

Now all the code _inside_ the function (i.e. in between `function () {` and `}`) will run. This doesn''t just work once either. You can tell yourself this joke over and over again:

``` {.js}
tellJoke()
tellJoke()
tellJoke()
```

### Passing arguments to functions

Now that we''ve built our first function, think back to some of the other things we''ve seen in JavaScript. For example:

``` {.js}
alert(''Hi'')
Math.round(4.5)
```

Both of these are functions too! They come built into JavaScript in the browser. Our function was a little different though. It didn''t have anything _inside_ the parentheses. That''s why it can only tell one joke. It doesn''t know how to accept and use outside information. Let''s fix that, by overwriting `tellJoke` with a new function:

``` {.js}
tellJoke = function (joke, punchline) {
  alert(joke)
  alert(punchline)
}
```

Now our function takes two *arguments*: the first is `joke` and the second is `punchline`. Arguments, like variables, remember information for us. We are using two pieces of information to tell _any_ joke:

``` {.js}
tellJoke(
  ''Two programmers walked into a bar.'',
  ''The third one ducked.''
)

tellJoke(
  ''My father told me to always go to other people\\''s funerals.'',
  ''Otherwise, they won\\''t go to yours.''
)

tellJoke(
  ''If you need money, just borrow it from a pessimist.'',
  ''They don\\''t expect it back.''
)
```

👏 👏 👏 &nbsp;&nbsp;Thank you, thank you. We''re here all night. 👏 👏 👏 

If you look closely, you''ll notice that with multiple arguments, you need to separate each one with a comma (`,`). 

We''ve also chosen to spread each function call out over multiple lines, to make it easier to read. That''s perfectly fine, because Javascript doesn''t actually read line-by-line. It reads _character-by-character_ and similar to HTML, it usually doesn''t care whether there are one or many spaces, tab characters, and/or new lines.

## Responding to the user interaction

So far, our entire joke-telling code should look something like this:

``` {.js}
const tellJoke = function (joke, punchline) {
  alert(joke)
  alert(punchline)
}

tellJoke(
  ''Two programmers walked into a bar.'',
  ''The third one ducked.''
)

tellJoke(
  ''My father told me to always go to other people\\''s funerals.'',
  ''Otherwise, they won\\''t go to yours.''
)

tellJoke(
  ''If you need money, just borrow it from a pessimist.'',
  ''They don\\''t expect it back.''
)
```

This is _technically_ interactive, but it''s not very respectful to users. It just floods them with jokes when they load the page! Terrific jokes -- I mean, there _was_ an emoji round of applause -- but still.

Instead, let''s only show a joke when the user asks for one. 

We can do this with *events*. Since JavaScript is all about interactivity, it needs a way to know when something has happened. For example, when they click on a `button`:

``` {.html}
<button>
  I''m a button!
</button>
```
~~~ {.result}
<button class="primary">
  I''m a button!
</button>
~~~

This is an element you may have never seen before. That''s because without JavaScript, it doesn''t do anything. It definitely _looks_ interactive, but it''s not yet.

So here''s a secret: when you click on that button, something _is_ happening. A `click` event is "firing" on that element every single time. It''s saying:

<blockquote>
  "Hey! So, I''m a button and I was just clicked. Anyone listening? Does anyone care? Anyone? Please?
</blockquote>

But no one is listening. It''s very sad. _We_ can listen though. First, we need a way to find the button. To do this, we''ll add a new attribute to the `button` called `id`:

``` {.html}
<button id="my-first-button">
  I''m a button!
</button>
```

~~~ {.note}
The `id` attribute is very similar to `class`, except an element can only have _one_ `id` and it must be unique within the page.

On the other hand, each element can have many class names and these names can be reused across many elements.
~~~

Now that we''ve given the `button` an `id`, we can find it with the `document.getElementById` function (*document* is what JavaScript calls the current page):

``` {.js}
const buttonElement = document.getElementById(''my-first-button'')
```

Then we can add an event listener for this button, specifically listening for the `click` event, using `addEventListener`:

``` {.js}
buttonElement.addEventListener(''click'', function () {
  console.log(''I was clicked!'')
})
```

~~~ {.note}
Some things in JavaScript, like HTML elements, have special functions attached to them with a dot (`.`). Both `getElementById` and `addEventListener` are examples. Functions like this are often called *methods*.
~~~

The `addEventListener` method requires two arguments:

1. The name of the event to listen for
2. The *callback* function, which JavaScript looks _back_ to and _calls_ whenever that event happens

~~~ {.note}
To better understand events and callbacks, think of a child out playing while her dad cooks dinner. Whenever dinner is done (the _event_), he''ll _call_ her _back_ inside to eat (the _callback_).
~~~

In this example, the event to listen for is `buttonElement` being `click`ed and the callback function is `console.log(''I was clicked!'')`.

~~~ {.note}
As with many things in programming, there are many different words that are used to describe events happening. For example, some will say the event was *triggered* or *fired* -- a lot of gun metaphors, for some reason.
~~~

### Debugging with `console.log`

You may be wondering what `console.log` does, as we haven''t talked about it yet. Well, it''s one of your new best friends. It just prints something to the console, which can be very useful for debugging.

In our case, it will confirm that our event listener really is working, by printing `I was clicked!` whenever we click on the button. If you''re not sure if a piece of code is running, or you want to check the value of a variable at a specific point, `console.log` is great for that.

### Checking for console errors

If your code isn''t quite working, you might also get an error in the console. For example, if you added your event listener, but forgot to define the `buttonElement` variable, like this:

``` {.js}
buttonElement.addEventListener(''click'', function () {
  console.log(''I was clicked!'')
})
```

Then you''d see this error:

``` {.output}
Uncaught ReferenceError: buttonElement is not defined
    at <script.js>:4:1
```

This one happens to be relatively self-explanatory: you have not defined `buttonElement`. It also tells you the file, line number, and column number the error came from. In this case, it came from `script.js`, at line `4`, column `1` (the column is the number of characters on the line before the problem was encountered).

If you had correctly defined `buttonElement`, but forgot to put the `id` on the element or misspelled the name of the `id` in either your HTML or JavaScript, then you''d see:

``` {.output}
Uncaught TypeError: Cannot read property ''addEventListener'' of null
    at <script.js>:6:17
```

This one requires a little more thinking through to understand. It says it has no idea what `addEventListener` is for `buttonElement`, because the value of `buttonElement` is not an element as we''d expect, but `null` (i.e. nothing). So the question is, how did `buttonElement` get a value of `null`?

Looking at the lines around where the error occurred, you''d eventually be able to conclude that `document.getElementById` couldn''t find an element with a matching `id`. Now you have a clue about what the problem might be.

If you see console errors you don''t understand, feel free to copy and paste them into Google or ask an instructor to help you understand it.

## The possibilities

*Can I do X in JavaScript?*

Almost certainly. Google it. Heck, there''s probably even a JavaScript *library* you can download (that''s code someone else already wrote that you can use), that will make it super easy to do exactly what you''re thinking of. There''s a JavaScript library for _everything_, because it''s the most popular programming language in the world.

*Everything? Really? I bet there isn''t a JavaScript library for -*

[Yes. There is.](http://theonion.github.io/fartscroll.js/)

*OK, but what if I wanted to -*

[Yes, even that.](http://theonion.github.io/comcastifyjs/)
', NULL, '-Kapml4wQlIbd_Vh2K33', 'Build a virtual drum kit (or sound mixer)', 'GitHub Pages', 3);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (208, 'html-meta-elements', 'Add metadata to improve SEO and social media sharing', 2, '## Introducing informational elements

There are some elements, such as `title`, that have no effect on the page content, but still provide important information. These are sometimes called *informational elements*. We''re going to learn about many of them now, but before we dive in, _why_ are they important? 

If they don''t affect page content, how do web browsers, search engines, and social media use this information to improve the experience of finding, visiting, and sharing your website?

### Why use informational elements?

#### In web browsers &nbsp;💻

By default, pages look pretty boring in web browsers:

![Boring browser tab](https://i.imgur.com/q9wCYEM.png)

You already know how to give them titles with the `title` element, but you can also give them pretty icons:

![MSU Home tab](https://i.imgur.com/uz0NXuJ.png)

This makes your site easier to find and more pleasant to look at in tabs, bookmarks, and mobile home screens.

#### In search results &nbsp;🚀

Without informational elements, listings on Google would look pretty boring:

![Boring MSU search result](https://i.imgur.com/h31G5bs.png?1)

Fortunately, we can make them more descriptive and interesting:

![MSU in Google results](https://i.imgur.com/WAPd2iV.png)

This extra information also helps you rank higher in search results!

#### On social media &nbsp;🎉

When sharing many links on social media, all people see is the URL -- often with the interesting parts cut out:

![Normal Tweet about RethinkDB](https://i.imgur.com/ych6Tau.png?1)

Fortunately, we have tools that can turn links on Facebook and Twitter into more eye-catching content, including titles, descriptions, images, and/or videos:

![Twitter card for National Geographic](https://i.imgur.com/kBYQhvm.png)

#### The result &nbsp;😲

These little details often make the difference between a hobby website and a trusted brand. By providing more information, we make it:

* easier for users to discover your website,
* more likely they''ll want to follow links, and
* a better experience during their visit

## Adding an icon for your website

Beyond the `title` element, there''s also one other that allows us to add an image to the browser tab:

![MSU Home tab](https://i.imgur.com/uz0NXuJ.png)

That image is called a *favicon* (short for _favorite icon_), as its original purpose was to appear next to saved links in favorites/bookmarks, before browsers even used tabs.

To add the favicon you just saw above, every page at MSU includes this `link` element inside its `head`:

``` {.html}
<link href="/favicon.ico" rel="shortcut icon">
```

<blockquote>
  Wha...? I''ve never seen an ICO file before in my life. Is that something you need fancy Photoshop skills to create?
</blockquote>

Nope! You''ll never have to create your own favicon. Instead, there are websites that will generate one for you, if you upload a square(ish) logo. We recommend [icoconverter.com](https://www.icoconverter.com/).

In most modern browsers, PNG and non-animated GIF images are [also supported](https://en.wikipedia.org/wiki/Favicon#File_format_support) -- just keep in mind that anyone using IE10 or below would see nothing.

### Updating a favicon

It''s a common (and frustrating) experience to update the favicon for a website, but still see the old version in your browser. This happens because browsers tend to cache favicons pretty aggressively.

So here''s a trick to get around it:

``` {.html}
<link href="/favicon.ico?version=1" rel="shortcut icon">
```

Anything after the `?` is treated as extra information attached to the URL, so the file is still just called `favicon.ico`, but if we update the version number in the `link` element:

``` {.html}
<link href="/favicon.ico?version=2" rel="shortcut icon">
```

Then the browser will see that the text inside the `href` has changed and most of them will re-download the favicon. You just have to remember to update that version number.

### Icons for _every_ kind of device &nbsp;📱

If you also want to integrate into iOS, Android, and Windows Phone, so that users can save your website (with icon) to their home screen, you''ll need a significantly more complex strategy. 

Fortunately, there are dozens of free services that can generate all the different icon versions you need, plus give you instructions on how to use them in your website. We recommend [realfavicongenerator.net](http://realfavicongenerator.net/). I know, it sounds like it''s trying too hard to actually be legit, but it is. 🙂

## Adding information for search engines

At this time in early 2017, there are only a few informational elements that search engines use to influence page rankings.

### Giving your page a title (`title` element)

The `title` is not only used in search results, but its content is also weighted more heavily than other text on the page.

### Describing your page (`meta name="description"` element)

This is a new element we haven''t seen before:

``` {.html}
<meta name="description" content="Spartans discover solutions for the world''s most challenging problems—from alternative energy to the environment, from health to education. Spartans Will.">
```

As you can see, it has two attributes: `name` and `content`. The `name` simply describes the kind of information in the `content`. 

For `name="description"`, the `content` should contain text describing the page, ideally no more than 160 characters. This information is usually used on search results:

![MSU in Google results](https://i.imgur.com/WAPd2iV.png)

And as you can see above, it''s common for homepages to describe the entire website. On every other page however, this information should be specific to the current page. 

For example, the National Geographic article we saw earlier used this description:

``` {.html}
<meta name="description" content="See Nepal Trekking Adventure Photos from Adventurers Like You">
```

Note that search engines usually place extra significance on keywords in descriptions, such as:

* Nepal 
* Trekking 
* Adventure 
* Photos
* Adventurers

However, *search engines usually ignore keywords that aren''t also visible on the page*. For example, if there was no mention of "Nepal" in the page content, searches for "national geographic nepal" would not show this page above others.

### Combining URLs (`link rel="canonical"` element)

Sometimes you want different URLs to all take you to the same page. For example, with these URLs:

* `https://mail.google.com`
* `https://mail.google.com/about`
* `https://gmail.com`
* `https://google.com/gmail`
* `https://google.com/gmail/about`

When you''re not signed in with a Google account, they all redirect to:

``` {.txt}
https://www.google.com/mail/about
```

However, if you search for "about gmail" in a search engine, that''s probably the only one of those links you''ll see, because the page contains this:

``` {.html}
<link rel="canonical" href="https://www.google.com/gmail/about/">
```

That tells search engines that `https://www.google.com/gmail/about/` is the *canonical URL* (i.e. the only one to really remember). So when they find pages that link to any of the other URLs, it''ll simply count towards the popularity of the canonical one, instead of listing 6 different links to the same page.

### Specifying a language (`lang` attribute)

Especially if your page uses a language other than English, specifying that language will help search engines connect you with the people who speak that language. The most common way to do this is by adding a `lang` attribute to your opening `html` element:

``` {.html}
<html lang="en">
```

This attribute accepts any [ISO 693-1 language code](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes).

### Specifying a location

If you''re building a website for a local business or institution, you might want to appear in search results for Google Maps and other location-specific search engines. There are a few attributes that can help.

#### Providing a region

``` {.html}
<meta name="geo.region" content="US-MI">
```

The `content` accepts any [ISO 3166-2 country subdivision](http://www.unece.org/cefact/locode/subdivisions.html).

#### Providing a place name

``` {.html}
<meta name="geo.placename" content="East Lansing">
```

The `content` typically contains the name of the city, town, village, or neighborhood.

#### Providing latitude and longitude coordinates

In order to place a marker on a map, search engines need your exact coordinates. There are two common elements for these:

``` {.html}
<meta name="geo.position" content="42.734163;-84.4828162">
<meta name="ICBM" content="42.734163, -84.4828162">
```
~~~ {.note}
Yes, ICBM, as in _inter-continental ballistic missile_ -- the Internet can be a little dark sometimes. 😬
~~~

Even though they''ll provide the same information, it''s good to include both of these elements, because some services might look for one, but not the other.

The easiest way to find these coordinates is probably by browsing around on Google Maps, then pulling them from the URL:

![MSU Union on Google Maps](https://i.imgur.com/68Erf5N.png)

### Superstition around SEO

When searching for something like “html elements for SEO”, you''ll probably find a lot of conflicting information and many more elements than we cover here. This is for a few reasons:

* 

  *Many rare `meta` elements*: We aren''t going over _every_ single kind of `meta` element in this lesson, instead focusing on the most commonly used and highest-impact ones.

* 

  *Out-of-date information*: Search engines used to pay more attention to many `meta` elements, but then websites abused them -- for example, adding the names of competing products to redirect customers. That''s why over time, search engines have become more selective about which information they pay attention to, but not everyone has stayed up-to-date.

* 

  *Search engine mysteries*: There''s always a bit of mystery around how search engines work. They release occasional reports and announcements, but they don''t share their exact strategy. This is because they don''t want competitors stealing their trade secrets and they also don''t want web developers to have so much information that it''s easier to cheat. As a result, people become superstitious and often provide more elements than they need to, just in case they might have some effect.

## Anti-SEO (making search engines ignore you)

There are times when you want your website (or just specific pages of your website) to be ignored. You can also accomplish this with a `meta` element!

### `meta name="robots"`

This one provides directions to any "robots" (e.g. search engines) visiting your page. The `content` contains a comma-separated list of requested behaviors. For example:

``` {.html}
<meta name="robots" content="noindex, nofollow">
```

That''s telling search engines _not_ to index (i.e. remember) this page and _not_ to follow links to other pages.

![Men in black: forget what you saw](https://i.imgur.com/mrRKYuU.jpg)

Unfortunately, while this does generally keep major search engines from remembering a page, it provides no guarantee that your request will be respected.

~~~ {.warning}
That means this is _not_ a security measure. If you have a page with sensitive information or special privileges, it''s still necessary to use authentication (i.e. confirm a visitor''s identity by making them sign in with an email and password).
~~~

### When to use `noindex`

If you check the source on a private YouTube video, you should see:

``` {.html}
<meta name="robots" content="noindex">
```

That means although the video is technically _public_ -- anyone with the URL can see that video -- search engines should never index it, because the user who posted it doesn''t want it appearing in search results. Note that because we don''t have `nofollow`, YouTube still invites search engines to follow links to related content.

The `noindex` rule is also useful for pages that are still in development, or have been semi-retired (e.g. documentation for a product you no longer support). For pages in development, just make sure to remove this element once you launch!

### When to use `nofollow`

It''s relatively rare to use `nofollow` without `noindex`, but the most common reason you might want _both_ of them is when you know any links on the page should _also_ not be indexed by search engines.

## Improving sharing on social media

We''ll only be covering Twitter and Facebook here, because that''s often all that''s necessary. When other networks need the same kind of information, they''ll usually look for the elements used by the big two.

This information can also change from time to time, so we''ll mostly be linking to the documentation for each network.

### Sharing on Twitter

Twitter provides [multiple types of "cards"](https://dev.twitter.com/cards/types), depending on the kind of content you''re sharing. Fortunately, their documentation is really excellent, including examples with screenshots.

Once you''ve added informational elements for Twitter, you can preview what a page will look like when it''s shared with the [Twitter Card Validator](https://cards-dev.twitter.com/validator).

![Passed validation on Twitter](http://i.imgur.com/nS2IL1C.png)

### Sharing on Facebook

Facebook uses a protocol called [_Open Graph_](http://ogp.me/), which they also invite other social networks to use. Their documentation isn''t quite as good as Twitter''s, but there are still examples. It''s a long document, but you can probably find all the elements you''ll ever use in the [_Basic Metadata_](http://ogp.me/#metadata) section (stop before _Structured Properties_).

Facebook also provides a tool for previewing what your page will look like when shared, called the [Open Graph Object Debugger](https://developers.facebook.com/tools/debug/).

![Passed validation on Facebook](http://i.imgur.com/86rU3cS.png)', NULL, '-Kapv98GMWDANx_f2DoK', 'Build a simple website for an imaginary, local store that sells geeky T-shirts', 'GitHub Pages', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (207, 'html-boilerplate-linting-and-code-style', 'Build fully valid and clean HTML', 1, '## The boilerplate for valid HTML

Ok... um, this is a little awkward, but we have to come clean. All the websites you''ve built so far have been _technically_ *invalid*. That means browsers can figure out what you''re trying to do, but you''re not actually giving them all the information they expect, in the structure they expect it in.

So, what''s wrong with this? The code still worked, didn''t it? Why is valid HTML important? Well, it''s like sending mail with a bad address:

![Bad address on an envelope](https://i.imgur.com/NW90kvc.jpg)

That letter may still reach its destination, or it might not. By addressing an envelope correctly -- or writing valid HTML, in our case -- you can greatly increase your chances of success.

With the structure we''re about to introduce, you also gain access to HTML elements that provide more information about the page. For example, what title should be displayed in the browser tab? If someone posts it to Facebook or Twitter, what image should appear next to the shared link? This is important information, but it doesn''t actually affect what shows up on the page. It''s just for browsers and other websites to read.

Now for a proper website, there''s some *boilerplate* that''s always necessary. Boilerplate is code that will be the same across all similar projects (like all webpages, in our case), but it''s necessary all the same.

But remember how we told you that programmers are lazy? It''s kind of annoying to retype the same code every time you start a new project. And VS Code is built _by_ programmers, _for_ programmers, so it comes with a feature to solve this problem, called *snippets*.

To use your first snippet, type `html`. Then you should see a little dropdown appear:

![Snippet dropdown](https://i.imgur.com/wyUnQdg.png)

Now use the arrow keys or mouse to select the `html:5` item from the list. You should suddenly see something like this:

``` {.html}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  
</body>
</html>
```

Woah - VS Code just typed all that for you! What is all this weird code? It should look sort of familiar, in the sense that it looks like HTML elements, but the names are new. Except for the first line:

``` {.html}
<!DOCTYPE html>
```

We''ve never seen an element that starts with `<!` before. Indeed, this self-closing element is one-of-a-kind: it''s called the *doctype declaration*. It declares the _type_ of _document_ for the browser, so that it knows how to read the rest of the file. The type it''s declaring in this case is `html`.

Now what about the rest of this code? Breaking it down, we have:

* `html`: This element goes directly below the doctype declaration and actually, _nothing_ else should ever exist outside the `html` element. Only two elements are allowed directly inside the `html` element: a single `head` element and a single `body` element.
* `head`: This is the element that contains all the information about the page that doesn''t show up on the page.
* `meta`: You can have many `meta` elements inside the `head`. They provide *metainfo* (i.e. information about the page). In our case, a few were created for us:
  * One defining the `charset` (character set) as `utf-8`, which guarantees we can use a wide range of international letters -- and most importantly, emoji! 🎈 🎉 🚀
  * One adjusting the `viewport` to the width of whichever device you view your website on (this is helpful for making websites that look good on phones, tablets, desktops, and more).
  * One that tells Internet Explorer to load the website using the most recent browser version that it can. Old versions of Internet Explorer had a *lot* of compatibility issues, so `X-UA-Compatible` was created so web developers can choose which version of Internet Explorer their site works well with. We''re teaching you the latest and greatest, so we''ll stick with `ie=edge`.
* `title`: This is the title of the page displayed in the browser tab. This element can _only_ contain text (no elements nested inside it), and it should never be left blank.
* `body`: Inside this element goes any content that should actually appear on the page, including all the elements we learned about in the previous lesson.

So given what you now know, what do you think you''ll see if you open up a file with this code in the browser?

``` {.html}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  
</body>
</html>
```

The answer is: nothing. The `body` is completely empty, so nothing will appear on the page. The `title` is also empty, so we won''t see any text in the browser tab. Try it yourself.

Let''s fix that. Try adding some code to the `body`, like a list of your favorite foods or something. Don''t think too hard about it. Then replace the word "Document" in the `title` with something appropriate for your page. Save, then refresh the browser. Do you see what you expect?

Congratulations, you just built your first 100% valid HTML! ⭐

~~~ {.note}
If you want to know if your website has valid HTML, enter your website''s address at [validator.w3.org](https://validator.w3.org/). This free tool will give a full report of anything that isn''t valid. 😉
~~~

## VS Code tricks for prosperous coding

After that big win from the last page, let''s take a step back and learn some more VS Code skills.

### Snippets, snippets, snippets

VS Code comes with a bunch more built-in snippets for HTML. For example, try typing in the name of an element (e.g. `h1`, `p`, etc), then press tab. It''ll automatically create the opening and closing tags for you, then move your cursor in between them!

### Linting your HTML

If you''ve ever done your own laundry, this might look familiar:

![Laundry lint trap](https://i.imgur.com/XRJY5R2.jpg)

That''s a lint trap for a dryer. It catches loose fibers, dirt, and other junk to keep it off your clothes. A *linter* for your code is similar. It searches for typos or other mistakes, then provides useful messages to help you clean it up, like this:

![linter-htmllint errors](https://i.imgur.com/SzNkbQT.png)

Notice the error messages at the bottom? They''re telling us that we have:

* an empty `title` element
* an `<h1>` tag without a closing `</h1>` tag

Isn''t that great? It''s like having another coder looking over your shoulder and catching tiny mistakes for you. This can save you from _hours_ of staring at your screen, looking for that one missing character that seems to be throwing everything off -- especially as you start building larger, more complex websites.

This power can be yours through VS Code''s extension system. In case you''re not aware, *extensions* are programs that change the behavior of or add new features to an existing program. In this case, we''re going to install an extension called `HTMLHint` that adds these helpful messages to VS Code.

To start, open VS Code''s extension settings with the shortcut `cmd`+`shift`+`X` (macOS) or `ctrl`+`shift`+`X` (Windows and Linux). Now click on the search box that appeared, type in `htmlhint` (the name of the extension we''re installing), then press enter. You should see `HTMLHint` in the search results. Once you find it, click on the green `Install` button to add the extension to VS Code.

![Installing HTMLHint](https://i.imgur.com/Em20GCJ.png)

After the extension is installed, the `Install` button may change to a `Reload` button. If it does, click the `Reload` button to restart VS Code.

Now head back over to your HTML file and type in some invalid HTML, like an element with a missing closing tag. If you see a squiggly line beneath the invalid HTML, great! If it still doesn''t work, ask an instructor for help.

You can also view a list of all linter warnings and errors by opening the Problems window. To open it, click on `View` → `Problems`. You can also click on the warning and error icons in the blue bar at the bottom of the VS Code window.

![Viewing a list of problems in VS Code](https://i.imgur.com/RwQaRPK.png)

## Writing code for humans to read

Try to read this code:

``` {.html}
<!DOCTYPE html><html>   <head><meta charset="utf-8">     <title>        My Daily Todos</title>
  </head>

            <body><h1>Todos
</h1>  <p>Here''s everything I want to achieve today:</p><ul>
  <li>Eat
food
 </li><li>
              Take a
  shower      </li><li>  Engage in
meaningful conversation
</li>


  <li>
Whatever else it is that humans do </li>   </ul>
          </body>      </html>
```

![xkcd code style](https://i.imgur.com/plRTR0P.png)

The point is, it''s an _absolute mess_. Now imagine trying to find a mistake in there! Or in the worst case scenario... having to review it as an instructor. 😉

Despite the fact that it''s a relatively small amount of code, it takes considerable effort to figure out what''s going on.

<blockquote>
  "Programs must be written for people to read, and only incidentally for machines to execute."
  <br> - <em>Harold Abelson</em>
</blockquote>

Now check out this code:

``` {.html}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>My Daily Todos</title>
  </head>
  <body>
    <h1>Todos</h1>
    <p>Here''s everything I want to achieve today:</p>
    <ul>
      <li>Eat food</li>
      <li>Take a shower</li>
      <li>Engage in meaningful conversation</li>
      <li>Whatever else it is that humans do</li>
    </ul>
  </body>
</html>
```

It''s actually the exact same, with one difference: consistent *indentation* and *spacing*. We''ll now explain what that means, along with a *style guide* you can follow to ensure your project isn''t rejected because your instructor refused to read it.

### Consistent indentation

Indentation is used to make code easier to read. If you''re not familiar with the word, this is indentation:

```
No indentation
 Indented 1 space
  Indented 2 spaces
   Indented 3 spaces
    Indented 4 spaces
```

It''s good practice to:

* Always indent lines by the same amount
* Indent lines when -- and only when -- they are inside of something

That means:

* Nested elements are always indented exactly one level beyond the indentation of their parent
* Sibling elements (ones that share the same parent) are always at the same level of indentation

Indentation can be made with either spaces or a single tab character. Programmers have a lot of debates about which is better and for spaces, how many to use. These debates will not happen here: *just use 2-space indentation*, which is also used in all the code examples on this site.

We''ll also teach you some new VS Code tricks to help you manage your indentation with relative ease:

### Settings to better see indentation

Open VS Code''s settings with the shortcut `cmd`+`,` (macOS) or `ctrl`+`,` (Windows and Linux). A tab with the title "Settings" will appear:

![VS Code settings](https://i.imgur.com/bHzfg1M.png)

VS Code provides a graphical user interface for changing settings. If you want to change a setting, you can search for the name of the setting in the "Search settings" text box and adjust it by typing or selecting the value that you want.

Let''s go ahead and update some of VS Code''s settings now to make our code easier to read and consistent across all of our projects:

#### Insert Spaces

![Editor: Insert Spaces](https://i.imgur.com/2xB88xV.png)

_Insert Spaces_ tells VS Code to insert spaces instead of tab characters when checked.

Make sure this setting is checked. It is much easier to see, change, and control indentation using spaces. Also, you will be asked to replace any tab characters with 2 spaces if they are seen in code reviews.

#### Tab Size

![Editor: Tab Size](https://i.imgur.com/alcjCZI.png)

_Tab Size_ is the number of spaces that will be inserted whenever you press the tab key.

Set this to `2` so that all of your indentation will be 2-spaces. If you don''t, your project will be rejected and you''ll be asked to fix it. 😜

#### Render Whitespace

![Editor: Render Whitespace](https://i.imgur.com/Y5zQ2w9.png)

_Render Whitespace_ controls whether VS Code should show subtle dots in place of spaces.

Select `boundary` for this setting. This will tell VS Code to show those little dots at the beginning and ends of your lines, but not show them between words. This is especially useful when making sure that each indentation in your code is using 2 spaces. 😉

#### Insert Final Newline

![Editor: Insert Final Newline](https://i.imgur.com/Q3sj61S.png)

_Insert Final Newline_ will make sure that the last character in any text file you save is a new line. Most linters and other tools expect a new line at the end of files.

Make sure this setting is checked. It will save you from having to remember to add the new line yourself.

~~~ {.note}
After you''ve made these changes to your settings, restart VS Code to start using them.
~~~

### Shortcuts for indenting and de-indenting

When you''re at the beginning of a line in VS Code, you can press:

* `Tab` to indent
* `Shift`+`Tab` to de-indent (indent backwards - try it!)

~~~ {.warning}
Remember that the tab _key_ is different from the tab _character_. When pressing the tab key, lines will be indented with spaces.
~~~

You can also highlight multiple lines, then use either of these shortcuts to indent or de-indent all of them together. This can save a lot of time!

### Consistent spacing

These are all examples of inconsistent spacing:

``` {.html}
<li> Eat food </li>
<li>Take a shower</li>
```
``` {.html}
<li> Eat food</li>
<li> Take a shower</li>
```
``` {.html}
<body>
  <h1>Todos</h1>

</body>
```

What do they have in common? There are inconsistencies in the spacing:

* between items, and/or
* across similar elements

These are all examples of acceptable spacing:

``` {.html}
<li>Eat food</li>
<li>Take a shower</li>
```
``` {.html}
<li> Eat food </li>
<li> Take a shower </li>
```
``` {.html}
<body>
  <h1>Todos</h1>
</body>
```
``` {.html}
<body>

  <h1>Todos</h1>

</body>
```

### Do it for future you

These rules might seem arbitrary at first. Aren''t we being a little too picky? The code _works_, right? Why does it matter if it''s perfectly consistent? It might be difficult to understand right now, but we promise, you will one day. As your brain gets more used to scanning for bugs, typos, and other problems, it becomes a highly-tuned pattern-matching machine.

That means to more experienced programmers, these tiny inconsistencies will stick out like a sore thumb. They''re distracting for instructors, so that they have less brainpower available to give you incredible feedback. And perhaps most of all, these inconsistencies _really_ stick out to potential employers.

So start practicing these skills now.

## Cheating (a little) using the `head` element

Now back to our regularly scheduled programming. (Yes, pun very much intended.) We haven''t yet learned how to use the other two languages of the web: CSS or JavaScript. However, programmers have a saying:

<blockquote>
  Good coders write good code.<br>Great coders steal better code.
</blockquote>

Of course, "steal" in the context means "use with permission." Fortunately, there''s a lot of free code that''s licensed to allow anyone to use it, for any purpose. We can use this code to immediately make our websites prettier.

The keys are the `head` element and one other element you''ll put inside the `head`: `link`.

### The `link` element

This element can do a lot of different things, but in this lesson, we''re only using it to include a CSS file that someone else wrote. Here''s an example:

``` {.html}
<link rel="stylesheet" href="design.css">
```

As you can see, this element is self-closing, like the `img` element. There are two attributes:

1. `rel`, which must have a value of `stylesheet` for CSS, and
2. `href`, which will be the link to the CSS file we''re "stealing".

In the example above, the `link` element is telling the web browser to download and use a stylesheet named `design.css` when rendering the HTML file.

Since the value of `href` does not begin with `https://` or `/`, the browser will assume that the file `design.css` exists in the same location as the HTML file in which the `link` element was found.

Here''s a link to a free collection of CSS code, called [Skeleton](http://getskeleton.com), that can immediately make everything look more professional:

``` {.txt}
https://cdnjs.cloudflare.com/ajax/libs/skeleton/2.0.4/skeleton.css
```

Even when writing their own CSS, a lot of programmers will include projects like this as a base to build upon. Now you''re one of them!

To use a stylesheet that has a full, long URL such as the one for Skeleton, replace `design.css` with the whole URL and the browser will download the CSS file from that location.
', NULL, '-K_w1Na6x65EebuRxwab', 'Upgrade the code from your last project to fully valid (and clean) HTML', 'GitHub Pages', 2);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (210, 'html-multiple-pages', 'Build a website with multiple pages', 1, '## Installing some new tools

So far, we''ve only built websites with a single page. To test them out, we''ve simply opened the `index.html` file in the browser. That''s worked well so far, but now that we''re moving into _multi_-page websites, we''ll need to install some new tools.

### Installing Node and NPM

First, we''ll install *Node* and *NPM* (the Node Package Manager). In this lesson, they''ll allow us to add new commands to our terminal, including a command to launch tiny webservers right on your computer. In later lessons, they''ll be essential in building even more complex websites.

To install these two tools, follow the instructions below for your operating system. Note that some of these installations will take a while, so it''s OK to read a book or something while you wait.

<details>
  <summary>macOS</summary>
  <ol>
    <li>
      In the terminal, install XCode (developer tools built by Apple)  with
      <code>xcode-select --install</code>
    </li>
    <li>
      In the terminal, install Node and NPM with
      <code>brew install node</code>
    </li>
  </ol>
</details>
<details>
  <summary>Windows</summary>
  <ol>
    <li>
      Download the installer for the "current" version of Node from 
      <a href="https://nodejs.org/en/" target="_blank">
        their downloads page
      </a>
    </li>
    <li>
      Follow the instructions in the installer, without changing any options (unless you really know what you''re doing)
    </li>
    <li>
      Restart your computer
    </li>
  </ol>
</details>
<details>
  <summary>Ubuntu</summary>
  <ol>
    <li>
      In the terminal, install some extra devtools with 
      <code>sudo apt-get install build-essential curl m4 ruby texinfo libbz2-dev libcurl4-openssl-dev libexpat-dev libncurses-dev zlib1g-dev</code>
    </li>
    <li>
      In the terminal, install Linuxbrew (a package manager for <em>more</em> developers tools on Linux) with
      <a href="http://linuxbrew.sh/" target="_blank">
        these instructions
      </a>
    </li>
    <li>
      In the terminal, install Node and NPM with
      <code>brew install node</code>
    </li>
  </ol>
</details>

Once you''re done, open the terminal and confirm that Node and NPM have installed correctly with these commands:

``` {.sh}
# Should return the version of node installed (e.g. 8.8.0).
# As long as the first number is greater than or equal to 6,
# everything has gone well!
node -v

# Should return the version of npm installed (e.g. 5.6.0).
# As long as the first number is greater than or equal to 3,
# everything has gone well!
npm -v
```

If anything went wrong, just seek help from an instructor.

### Installing live-server

Now that we have Node and NPM installed, we can install *live-server* with:

``` {.sh}
npm install --global live-server
```

That installs the `live-server` command on your computer *globally*, meaning once it''s installed, you can run it from any directory. Once the install finishes, test that it''s working by `cd`ing into the directory of a previous project, then entering the `live-server` command.

After a few seconds, the `index.html` file should open in your default browser, with something like `localhost:8080` or `127.0.0.1:8080` in the browser''s address bar. You can stop `live-server` at any time by pressing `Ctrl`+`C` (even though it means _copy_ everywhere else, `Ctrl`+`C` actually means _cancel_ in the terminal).

Again, if anything went wrong, or you just want to double check something, let an instructor know.

## VS Code + live-server = 😍

Something really nice about live-server is that it''s... well, _live_. That means every time you save, the page automatically refreshes:

![VS Code and live-server](https://i.imgur.com/wGmcQtL.gif)

This means you can edit your code and see the result at the same time and the version in the browser will _always_ be up-to-date. Definitely a productivity boost!

## Build a multi-page website

Okay, back to our website. As you''ve probably noticed, most websites have many pages. So how do we make that happen? We''re going to practice in the directory of your last project, so open that directory in VS Code. 

Now let''s say we want an about page. To accomplish this, we can create a new file called `about.html` (next to your `index.html`). Once created, put some valid HTML on that page. 

Now in your terminal, `cd` into this directory and run `live-server`. Once open, try visiting your website at `localhost:8080/about.html`. Do you see your about page?

Try to follow the same steps to create a contact page.

### Getting rid of the `.html` in page names

You may have noticed that on most sites, you don''t see a `.html` at the end of page names. Instead of going to `some-website.com/about.html`, the page will be `some-website.com/about`. To accomplish this:

1. Make a folder called `about` in your project folder
2. Move `about.html` into the `about` folder
3. Rename `about.html` to `index.html`

Now try visiting `localhost:8080/about`. Your about page should now appear there!

Again, try following the same instructions for your contact page.

### What if you want multiple words in your page names?

If you want the words "about us" to be in the page name, instead of just "about", the most common and accepted strategy is to separate words with dashes, like this: `about-us`.

### Can I include capitals in my page names?

Yes, technically, but it''s best to avoid it in most situations. People are used to URLs being lowercase.

## Nested routes

First, what''s a *route*? A route is what you add to the end of a domain name (e.g. `google.com`, `msu.edu`) to get to the page. It _always_ begins with a forward slash (`/`). So for example, the route for:

* your homepage is `/`
* your about page is `/about`
* your contact page is (probably) `/contact`

A *nested route* has two or more forward slashes. For example, the page you''re on right now has a nested route, split up into multiple parts:

1. `/courses`
2. `/` + the name of this course
3. `/lessons`
4. `/html-multiple-pages` (the name of the lesson)
5. `/4` (the current page in the lesson content)

Each level gives more and more specific information about the *address* to your page.

### Building nested routes

A common example of when you might want nested routes is in a staff page for a business. Frequently, there''ll be a page that lists _all_ of the staff. This might be at `/staff`. Then there might also be pages for each individual staff member, such as `/staff/alice`, `/staff/juan`, etc. 

Can you guess how we''d make this possible? 

You''d need a directory structure like this:

``` {.txt}
my-business-website
|-- index.html         # /
|-- about
|   |-- index.html     # /about
|-- staff
|   |-- index.html     # /staff
|   |-- alice
|   |   |-- index.html # /staff/alice
|   |-- juan
|   |   |-- index.html # /staff/juan
|   |-- sandeep
|   |   |-- index.html # /staff/sandeep
```

Just as before, we use directories to name each part of our routes and `index.html` files to define what should be displayed on each page.

## Absolute, relative, and root-relative links

When you''re linking to _other_ websites, you''ll always use the full address of that website, like this:

``` {.html}
<a href="http://www.google.com/about">
  Google''s about page
</a>
```

This is an *absolute link*, meaning it will work no matter where on the entire Internet that link is.

On most websites, there''s also some kind of navigation menu -- a list of links to pages on that website. When linking to one of your _own_ pages (i.e. *internal links*), you don''t need to specify the full address, including the protocol (e.g. `http://`) and domain (e.g. `my-website.com`). 

Instead, you can just use the route:

``` {.html}
<a href="/about">
  My about page
</a>
```

This is called a *root-relative link*. For internal links, it''s actually better than an absolute link, because then it''ll work in both *development* (on your computer) and in *production* (where it''s live on the Internet).

If your website were actually at `my-website.com`, clicking on a link to `/about` would take you to:

* `http://localhost:8080/about` in development, and
* `http://my-website.com/about` in production

It''s important to note that the `/` at the beginning _is_ important. If you leave off the `/` at the beginning, the link becomes *relative*, meaning it''s giving the web browser directions _relative to the current page_.

For example, if you''re on the `/staff` page and you want to link to `/staff/alice`, you could use this relative link:

``` {.html}
<a href="alice">Meet Alice</a>
```

Now let''s say you''re at `/staff/alice` and you want to link to `/staff/juan`. In this case, you could use the double dots (`..`) we learned about for navigating the terminal, plus `/juan`:

``` {.html}
<a href="../juan">Meet Juan</a>
```

![Koala''s mind being blown](https://i.imgur.com/fPV6j4B.png)

I know, Koala. I know.

There''s a problem with relative links though. If you copy them from their current page to almost any other page, they''ll break. That''s why most of the time, *it''s best to stick with root-relative links*. Then no matter what page you''re on, or how often you copy and paste your code around, your links will _always_ work!

### Root-relative links on GitHub Pages

OK, there _is_ one issue with root-relative links. Actually, it''s an issue with GitHub Pages. GitHub serves projects to URLs like this:

`https://USERNAME.github.io/PROJECT-NAME`

Since the root of a website is the domain (`USERNAME.github.io`), a link to `/about` would actually take you to `https://USERNAME.github.io/about`, which is completely outside your project!

To resolve this, we actually won''t be submitting our code to GitHub Pages this time. Instead, we''ll use NPM to install a command-line tool for the [Surge](https://surge.sh/) hosting service:

``` {.sh}
npm install --global surge
```

Like GitHub Pages, Surge _also_ allows us to publish as many free sites as we want, but it publishes to `SOME-RANDOM-SUBDOMAIN.surge.sh` instead, which is much friendlier to root-relative links (and more like a real website). The instructions for this lesson''s project will guide you in publishing this project to Surge.
', NULL, '-KaKuDC9-J3Bx8T_njfg', 'Build a fansite for books, movies, video games, or anything else', 'Surge', 2);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (213, 'js-collect-and-display-information', 'Use JavaScript to collect, remember, and display info', 2, '## Automatically catch errors and style violations (JS Standard)

As we write more complex JavaScript, it becomes easier to have one little typo that throws everything off. For example, missing the `const` or `let` when declaring a new variable:

``` {.js}
greeting = ''hello''
```

There''s good news though: a linter -- similar to the one we installed for HTML -- can catch _many_ of them. It can also help us write in a consistent style, already used by many professisonals. For projects in this course, we''ll be using the [*JS Standard*](https://github.com/feross/standard) linter and style.

Once we set it up, you''ll start seeing helpful warnings when there''s something wrong:

![JS Standard warning example](https://i.imgur.com/Qnq7gxe.png)

This can save you a _lot_ of time, helping you catch errors before you even run code in a browser. When following a strict style, it''s also much easier to see when something is out of place -- both for you and anyone else looking at your code.

### Using JS Standard in VS Code

Once again, we''ll install a VS Code extension to help us catch errors. Follow these steps now:

1. In a terminal, run the command `npm install -g standard`
2. Open VS Code
3. Go to your extension settings with `Cmd`+`Shift`+`X` (macOS) or `Ctrl`+`Shift`+`X` (Windows/Linux)
4. Search for `StandardJS` and click the green `Install` button for the extension written by Sam Chen

That''s it. You should now see helpful warnings in all future JavaScript!

~~~ {.note}
For those with previous JavaScript experience, it may surprise you that JS Standard warns you about unnecessary semicolons. It''s actually a common misconception that semicolons are necessary at the end of every statement, such as:

![JS Standard Warning: Extra semicolon](https://i.imgur.com/TBTaaOs.png)

You may have even been told that leaving out a semicolon can cause mysterious bugs in some browsers, break minifiers, or that the rules for when a semicolon really is necessary are just too complex. All of this is false and this is the only rule:

<blockquote>
  If a line begins with <code>[</code>, <code>(</code>, or <code>`</code>, begin it with a semicolon (e.g. <code>;[</code>, <code>;(</code>, or <code>;`</code>).
</blockquote>

When using JS Standard, you don''t even have to remember this. The linter  will tell you when you''re missing a semicolon in those very rare cases when one is required.
~~~

## Collecting information from users (`prompt`, `input`)

### The `prompt` function

There are many ways to collect information from users in JavaScript. One of the simplest is with the `prompt` function:

<iframe width="100%" height="220" src="//jsfiddle.net/hcodelab/6q7xrs3u/1/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

`prompt` is a lot like `alert`, except it has an input box where users can type something in. If you assign the *return value* of the `prompt` to a variable, you''ll be able to save what the user typed as a string.

You may also notice that we''re using the addition operator (`+`) with _strings_, instead of with numbers like you saw in a previous lesson. When `+` is used with strings, it *concatenates* (i.e. combines) them.

### The `input` element

A much more common way of collecting information from a user is with the self-closing `input` element. You''ve probably seen it every time you filled out a form online. It''s just a box you click on and type stuff into:

``` {.html}
<input placeholder="What''s your name?">
```
~~~ {.result}
<input placeholder="What''s your name?">
~~~

Unlike `prompt`, the `input` element allows us to collect a lot of information at once before we have to respond to it. You can see it demonstrated in this variation of the code above:

<iframe width="100%" height="300" src="//jsfiddle.net/hcodelab/9ky372sz/3/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

As you can see, we can get what the user typed by looking at the `value` of an `input` element and store it in a variable. 

We can also _set_ the value of an `input` with `=`:

<iframe width="100%" height="200" src="//jsfiddle.net/hcodelab/qsLy2nh8/1/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## Accessing (and setting) information about elements

In the previous lesson, you learned that a *method* is a function attached to something with a dot (`.`). Examples include:

* `Math.round()`
* `document.getElementById()`
* `element.addEventListener()`
* `console.log()`

These functions always do something related to what they''re attached to.

* `Math.round()`: _rounding_ is a type of _Math_
* `document.getElementById()`: we''re _getting an element by ID_ inside the _document_ (i.e. page)
* `element.addEventListener()`: we''re _adding a listener_ for an _event_ on the _element_
* `console.log()`: we''re _logging_ something to the _console_

Methods are actually a specific kind of *property*, which in Javascript, is what you call anything that''s connected by a dot to something else. On the previous page, we accessed the text in the `input` element with the `value` property. The dot actually implies a relationship: the `value` _belongs to_ the `input`.

### Exploring properties in the console

But what if we hadn''t told you that `value` existed? How would you know? How did _we_ know? Where do you find out what you can do with an element in JavaScript? How can you learn about what _properties_ it has?

Fortunately, Chrome''s console has some tricks to help us here. Open it now with `Cmd`+`Option`+`J` (macOS) or `Ctrl`+`Shift`+`J` (Windows/Linux).

We''ll be playing with the `input` below, which has an attribute we haven''t seen before: `disabled`.

``` {.html}
<input 
  id="test-input"
  placeholder="What''s your name?"
  disabled
>
``` 
~~~ {.result}
<input 
  id="test-input"
  placeholder="What''s your name?"
  disabled
>
~~~

This attribute stops you from typing anything in the `input`. Well, it would stop _most_ people -- not you though. Nothing can stop a JavaScript developer for long. 😉 &nbsp;We''re going to hack this page and disable `disabled`! Then we''ll type anything we #%@$ing want.

First, let''s get this element by its `id` and store it in a variable. Once you''ve done this, if you type in the name of the variable and then a dot, you''ll see an autocomplete like this:

![Chrome console property auto-suggest](https://i.imgur.com/CHumE1m.png)

That''s a really long list of all the properties on the element. Many of them you probably won''t ever use, especially the items at the beginning in all caps or beginning with `__`. As we scroll down though, we''ll soon see a familiar item: `addEventListener`.

![Chrome console addEventListener](https://i.imgur.com/9SyEu0o.png)

OK, so back to that `disabled` attribute. Let''s take a stab in the dark and just start typing the name of the attribute after the dot.

![Chrome console element.disabled auto-suggest](https://i.imgur.com/XdroMGJ.png)

Hey, the autocomplete found something! Let''s tab-complete it (just like on the terminal) and press `Enter`.

![Chrome console test.disabled true](https://i.imgur.com/hYYyjIk.png)

It looks like the value of the `disabled` property is `true`. I guess that means the `input` is disabled... but, we knew that already. In programming, the opposite of `true` is `false`, so let''s see if we can set this property:

![Chrome console test.disabled = false](https://i.imgur.com/n07nyzr.png)

Now look back at the `input` element above. You should be able to type into it now! That means even for pages that you didn''t write, you can open up the console and start exploring elements to see how they work.

## Researching properties you find in the console

In the console, you can not only explore properties for elements, but almost _anything_ in JavaScript, including strings, numbers, `true`, or `false`.

First, let''s try to learn more about strings. Just as before, we can assign a string to a variable, then type its name followed by a dot:

![myString followed by a dot](https://i.imgur.com/WNnPYEU.png)

Once again, we get a list of things we can do. The first item that doesn''t start with `__` is `anchor`, so let''s check that out:

![myString.anchor](https://i.imgur.com/cjBI5Pj.png)

Sometimes when trying to explore a property, you''ll see a function returned. That means `anchor` is actually a method, so let''s try calling it with parentheses after the name:

![myString.anchor()](https://i.imgur.com/nWYRYFq.png)

It returned a new string, wrapping our text in an anchor (`a`) element. OK, so now we''ve discovered nearly all we can about this method by just playing around. Let''s visit Google. 

One of the best resources for finding out more about things in JavaScript is the *Mozilla Developer Network (MDN)*. To find resources specifically from MDN, I''ll search on Google for `mdn string anchor method`. The [first result](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/anchor) will show us something like this:

![MDN String.prototype.anchor](https://i.imgur.com/O4mGVQh.png)


This tells us that the `anchor` method takes one *parameter* (another name for _argument_), which will be a string used for the `name` attribute. Let''s try it:

![myString.anchor(''testing123'')](https://i.imgur.com/1B89S0M.png)

Yay! Now we know pretty much everything about how to use the `anchor` method. It''s pretty simple, but honestly not very useful. We could create this string almost as easily like this:

``` {.js}
''<a name="testing123">'' + myString + ''</a>''
```

Some properties are like this, but others -- as you''ll see later on this page -- are _very_ useful and allow you to create new kinds of features that would be much more difficult, or even impossible, without them.

~~~ {.note}
### Browser compatability

There''s other important information on MDN pages about browser compatability, usually near the bottom of the page. It looks like this:

![Browser compatability table](https://i.imgur.com/wGEpHRh.png)

It''s a table that lists which browsers the feature works in. That''s right. Some features of HTML, CSS, and JavaScript only work in certain browsers. For example, the `audio` element that you used in the previous project doesn''t work in Internet Explorer 8 (IE8) and below.

*For every single feature I learn about, am I supposed to memorize which browsers it works in?*

No, absolutely not. In fact, we''ll mostly only be teaching features that are generally safe. When there''s an exception, we''ll put it in a big scary warning box! Even in those cases though, you really only have to remember that it''s not completely supported -- and don''t worry about the other details. 

*How do I know when to care? What percentage of people are using a specific browser version?*

There''s another website that can answer this question: [CanIUse.com](http://caniuse.com/). Here, you can search for specific features and it shows you a much prettier table of browser support. When you hover over a browser version, such as IE8 below, you can learn more about usage information:

![caniuse.com audio element IE8 usage](https://i.imgur.com/8UuQXxi.png)

As you can see, IE8 is used by about 0.42% of both the world and the United States. Within goverment agencies and some large corporations, this can be much higher, but within other demographics, such as millenials, it''s probably much smaller.
~~~

## Updating HTML (`textContent`, `innerHTML`)

Possibly the most-used property on strings is `length`. It tells you how many characters are in that string. For example:

``` {.js}
''blah blah''.length
```
``` {.output}
9
```

If you''re familiar with Twitter, you''ve probably seen the little number in the corner that tells you how many characters you have left of the 280-character limit. The `length` property is essential for this:

<iframe width="100%" height="200" src="//jsfiddle.net/hcodelab/uyaz94nq/2/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

Besides `length`, there are a few other new things in there:

* 

  a *`textarea` element*, which is very similar to an `input` element, but can have multiple lines and be resized

* 

  an *`input` event*, which fires every time the `value` of a form element (such as `input` or `textarea`) changes

* 

  a *`textContent` property*, which we use to change the text inside the `span` element

### `textContent` vs `innerHTML`

There are actually two main ways to set the content of an element. The first one, `textContent`, you just saw in action. It''s not ideal for every situation though. For example, if we wanted to inject some HTML into the page, like `<strong>Hello</strong>`, using `textContent` gives us this:

``` {.html}
<p id="my-paragraph"></p>
<script>
  const paragraph = document.getElementById(''my-paragraph'')
  paragraph.textContent = ''<strong>Hey</strong> there''
</script>
```
~~~ {.result}
<p>&lt;strong&gt;Hey&lt;/strong&gt; there</p>
~~~

As you can see, it''s _literally_ showing us our code instead of rendering it as HTML. This can be very useful sometimes, for example when displaying code examples to students. 😉 

If we wanted to make it render as HTML though, we could instead use `innerHTML`:

``` {.html}
<p id="my-paragraph"></p>
<script>
  const paragraph = document.getElementById(''my-paragraph'')
  paragraph.innerHTML = ''<strong>Hey</strong> there''
</script>
```
~~~ {.result}
<p><strong>Hey</strong> there</p>
~~~

Now our markup is actually rendered by the browser, having an effect on the page without being displayed to the user. This is useful when you have content that''s stored as HTML, just like the lesson you''re reading right now! 😲

There''s not only a difference in the way these properties _set_ the content of an element, but also in the content they _get_:

``` {.html}
<p id="my-paragraph">
  <strong>Hey</strong> there
</p>
<script>
  const paragraph = document.getElementById(''my-paragraph'')
  console.log(paragraph.textContent) //=> "Hey there"
  console.log(paragraph.innerHTML)   //=> "<strong>Hey</strong> there"
</script>
```

As you can see:

* 
  
  `textContent` only gets the text, ignoring any HTML. This is useful when extracting information from the page and all you care about is what the user sees -- not how the underlying code is structured.

* 

  `innerHTML` gets the entire content of the element, _including_ all HTML. This is especially useful when you want to create a copy of the HTML or transform it in some way.
  
## Refactoring code

Ever heard of a madlib? It''s an activity where someone provides types of words without context (e.g. place, adjective, type of weather) and then they get placed into a story that will inevitably be very silly. JavaScript is great for building madlibs, like this one:

<iframe width="100%" height="589" src="//jsfiddle.net/hcodelab/8oe390t5/2/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

That code technically _works_, but it has a few problems:
  
* 

  *Duplicated code*: For each `input` element, we''re adding an identical event listener, repeating the same code every time. That means if we wanted to change the text that makes up the story, we''d have to change it in the exact same way, in three places in our code! If we wanted to add a new input, we''d then have to duplicate it _again_, then update the story in _four_ places. 😬

* 

  *Very long lines*: We have to scroll to the right a lot to read the entire story that we''re setting to `madlibParagraph.innerHTML`. It''s quite annoying.
  
To solve these problems, we need to *refactor*. Refactoring just means changing the code, _without_ changing what it does. The goal is to make the code easier to read and work on in the future. It''s usually the last step after working on any feature.

Out of laziness, let''s start our refactor to solve the duplicated code problem first. Then when we work on the very long lines problem, we''ll only have to do it once! 😎

### De-duplicating code with functions

In the first JavaScript lesson, we used functions to tell jokes, like this:

``` {.js}
const tellJoke = function () {
  const joke = ''Why did the chicken cross the road?''
  const punchline = ''To get to the other side.''
  
  window.alert(joke)
  window.alert(punchline)
}
```

After that, we could tell the joke at any time, by simply calling the `tellJoke` function with its name, plus parentheses:

``` {.js}
tellJoke()
```

We''re going to do the same thing with the function(s) that update the madlib on the page:

``` {.js}
const updateMadlib = function () {
  const animal = animalInput.value
  const adjective = adjectiveInput.value
  const verb = verbInput.value

  madlibParagraph.innerHTML = ''There once were three <strong>'' + animal + ''</strong> that were very <strong>'' + adjective + ''</strong> because they couldn\\''t stop <strong>'' + verb + ''</strong> all day.''
}

animalInput.addEventListener(''input'', updateMadlib)
adjectiveInput.addEventListener(''input'', updateMadlib)
verbInput.addEventListener(''input'', updateMadlib)
```

The functionality hasn''t changed, but we''re not repeating ourselves anymore, so making changes will be a lot easier in the future! 

Note however that we''re not _calling_ `updateMadlib` (there are no parentheses after its name when we pass it to `addEventListener`). That''s because instead of running it right away, we want to let the event listener take care of calling it whenever the `input` event is triggered.

OK, now that our code is a bit more manageable, let''s take care of that one really long line.

### Spreading statements over multiple lines

Statements don''t actually have to stay on a single line in JavaScript. Instead, you can do something like this:

``` {.js}
madlibParagraph.innerHTML = 
  ''There once were three '' +
  ''<strong>'' + animal + ''</strong> '' +
  ''that were very '' +
  ''<strong>'' + adjective + ''</strong> '' +
  ''because they couldn\\''t stop '' +
  ''<strong>'' + verb + ''</strong> '' +
  ''all day.''
```

This works because, as mentioned previously, JavaScript reads code character-by-character. It only recognizes a statement is done when it stops seeing characters like `=` or `+`, which both tell it, "But wait, there''s more to this statement!"

Also note that we indented every line after the first one, so that at a glance, we can tell these lines are related.

### Refactor complete!

Our final JavaScript now looks like this:

``` {.js}
const animalInput = document.getElementById(''animal'')
const adjectiveInput = document.getElementById(''adjective'')
const verbInput = document.getElementById(''verb'')
const madlibParagraph = document.getElementById(''madlib'')

const updateMadlib = function () {
  const animal = animalInput.value
  const adjective = adjectiveInput.value
  const verb = verbInput.value

  madlibParagraph.innerHTML = 
    ''There once were three '' +
    ''<strong>'' + animal + ''</strong> '' +
    ''that were very '' +
    ''<strong>'' + adjective + ''</strong> '' +
    ''because they couldn\\''t stop '' +
    ''<strong>'' + verb + ''</strong> '' +
    ''all day.''
}

animalInput.addEventListener(''input'', updateMadlib)
adjectiveInput.addEventListener(''input'', updateMadlib)
verbInput.addEventListener(''input'', updateMadlib)
```

Again, it does exactly the same work, but is easier to read and maintain.
', NULL, '-Kapnz_vqJpnAfkPt9Fl', 'Build a dating profile generator', 'GitHub Pages', 2);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (220, 'js-server-intro', 'Build a simple web server with Node', 2, '## What is _server_-side web development?

When you check your email, you don''t see _everyone''s_ emails. Just yours. And it doesn''t matter whether you check on your laptop, phone, or a school computer -- you see the same thing.

That''s because your emails aren''t saved in the browser, with `localStorage`. They''re saved on a _separate_ computer you connect to through the Internet. This other computer is called a *server*.

![Server in a restaurant](https://i.imgur.com/s54touE.png)

Yep, that''s the basic idea. In a restaurant, you talk to servers and they bring you things.

On the Internet, it works the same way. Web browsers (i.e. the "clients") talk to servers and the servers _serve_ them HTML, CSS, JavaScript, images, sound files - or whatever else we ask for.

We can write code that runs on these servers to:

* Check which page is being requested
* Check who''s requesting the page
* Look up saved information
* Save new information
* Generate custom HTML

And much more. 

Writing the code that runs on servers is called *server-side* or *backend*  development. What we''ve been doing so far -- writing HTML, CSS, and JavaScript that runs in a web browser -- is called *client-side* or *frontend* development.

This doesn''t mean we''re "done" with client-side development or that server-side development is somehow more advanced. In order to build modern web applications, we really need both. They work together. 

In many lessons going forward, including this one, we''ll be writing _both_ kinds of code.

## Building a web server in JavaScript

Unfortunately, the word "server" is a little overloaded. It refers not only to the physical machine that hosts a website, but _also to the code_ that runs the website. From now on, when we say "server", we''ll usually be referring to code -- but don''t worry, you can almost always tell from context.

Web servers can be written with many different programming languages, but we''ll be using JavaScript for a few reasons:

* 

  *Simplicity*: You don''t have to learn a completely new language! Learning server-side development can be complicated enough, so let''s focus on that.
  
* 
  
  *Universality*: JavaScript can run almost _anywhere_. That means as you grow more confident with it, you''ll be able to transfer your skills to writing apps for phones, tablets, computers, watches, the terminal, and more.

* 

  *Popularity*: JavaScript is probably the most popular programming language in the world. There are a lot of jobs available and many resources that make learning easier, such as books, blogs, videos, forums, and events.

### Introducing Node

In a much earlier lesson, you installed a program called *Node*. Node runs JavaScript _outside the browser_.

Before we write our first Node app, let''s actually start our project from the _Project_ tab of this page, then clone it to your computer as usual. Now in your project directory, create a new file called `hello.js`. The name isn''t important.

Inside it, include a single line:

``` {#hello.js}
console.log(''Hi!!'')
```

Now if we open the terminal and `cd` to our project directory, we can run that file with `node hello.js`. It should log:

``` {.output}
Hi!!
```

That''s it. You just coded and ran your first Node app!

### Your first web server

It''s not a web server though. Instead of talking to web browsers, it just outputs text on the terminal. So let''s upgrade it. 

First, we''ll rename the file to `server.js` to better describe its new purpose. Then we''ll start with the simplest possible web server:

``` {#server.js}
// Require Node''s http module and assign it to a variable
const http = require(''http'')

// Create a new server that just says "Hi!!" at every route
const server = http.createServer(function (request, response) {
  response.end(''Hi!!'')
})

// Listen on port 8080, so that we can reach the app at
// localhost:8080
const port = 8080
server.listen(port)

// Output a friendly message to the terminal
console.log(''Server running at http://localhost:'' + port + ''/'')
```

We''ll explore each line in detail, but first, try it out by saving the file and running `node server.js` in the terminal. Then in your browser, visit `localhost:8080`. Whether you visit `/`, `/about`, or `/cat-pictures`, you should always see the text: `Hi!!`.

![Browser preview](https://i.imgur.com/JrZiL08.png)

Now going back to your file, change `Hi!!` to something else, like `Hey there`. Save the file, then go back to your browser and refresh the page.

If you still see `Hi!!` instead of `Hey there`, don''t worry. That''s normal.

~~~ {.warning}
When you run a web server with Node, it reads your code only once and saves it into memory. That means *if you change the code, you''ll have to shut down your web server with `Ctrl`+`C`, then start it again with `node server.js` to see your changes take effect*.
~~~

## Touring the code of our first web server

Even in this simplest possible example, there''s some code we haven''t seen before, starting with the first line:

``` {#server.js}
// Require Node''s http module and assign it to a variable
const http = require(''http'')
```

Just as the browser provides `window` and `document` to interact with the page, Node provides its own tools, such as the *`require`* function. 

`require` runs code from other JavaScript modules (more on these in a later lesson). The *`http`* module is built into Node and returns an object with a *`createServer`* method, allowing us to create a simple web server, like below:

``` {#server.js}
// Create a new server that just says "Hi!!" at every route
const server = http.createServer(function (request, response) {
  response.end(''Hi!!'')
})
```

As you can see, `createServer` accepts a single argument: a function with what to do when this website is visited.

Passed to this function are two arguments:

* *`request`*: An object containing information about what the user requested (e.g. the URL)
* *`response`*: An object with methods we can use send information to the client

In our current code, we don''t even look at the `request`. No matter what URL a user visits, we do the same thing: call `response.end(''Hi!!'')` to send the text `Hi!!` and end the connection with the client.

At this point though, there still isn''t a way for the browser to talk to our web server, because it''s not *listening* for requests. In order to change this, we call `server.listen` with the port number `8080`:

``` {#server.js}
// Listen on port 8080, so that we can reach the app at
// localhost:8080
const port = 8080
server.listen(port)
```

~~~ {.note}
The number `8080` isn''t special here. We could actually use [any of these port numbers](https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers), as long as it wasn''t already being used by another application. `8080` is simply one of the ports commonly used for web development.

<blockquote>
  So why don''t we need to connect to a specific port when visiting live websites, like <code>https://msu.edu:8080/</code>? 
</blockquote>

Web browsers actually _do_ connect to a specific port. When a port isn''t provided, browsers automatically connect to port `80` for `http` and port `443` for `https`. 

If you visit `https://msu.edu:443/`, you''ll notice that it still works!
~~~

Finally, the last line of our web server should look pretty familiar:

``` {#server.js}
// Output a friendly message to the terminal
console.log(''Server running at http://localhost:'' + port + ''/'')
```

We display a short message, but since we''re using Node, it appears in the terminal instead of in the browser''s JavaScript console.

## Responding to different routes

While our web server technically _works_, it''s pretty boring. It shows the same thing at _every_ URL. Fortunately, we can access the requested URL with `request.url`:

``` {#server.js}
const server = http.createServer(function (request, response) {
  if (request.url === ''/'') {
    response.end(''Home'')
  } else if (request.url === ''/about'') {
    response.end(''About'')
  } else {
    response.end(''Page Not Found'')
  }
})
```

Now we show specific content for `/` and `/about`, then simply display "Page Not Found" for anything else (e.g. `/cat-pictures`, `/secret-diary`).

Currently, we only display plain text, but we can also respond with strings of HTML. For example:

``` {#server.js}
const server = http.createServer(function (request, response) {
  if (request.url === ''/'') {
    response.end( 
      ''<h1>Home</h1>'' +
      ''<img src="https://i.imgur.com/jKhQJVH.jpg" alt="Waving hi">''
    )
  } else if (request.url === ''/about'') {
    response.end(''<h1>About</h1>'')
  } else {
    response.end(''<h1>Page Not Found</h1>'')
  }
})
```

For the sake of brevity, we''re taking a break from _valid_ HTML for now. 😬 🙈

![Browser preview](https://i.imgur.com/Y46z7kf.png)

## Deploying your web server with Heroku

Unfortunately, GitHub Pages or Surge can''t host server-side applications, so instead, we''ll be using a new service called *Heroku*. For this, you''ll have to:

1. [Sign up for a free account](https://signup.heroku.com/)

  ~~~ {.warning}
  Note that though Heroku may ask you to "verify" your account with a credit card, you _never_ have to provide one.
  ~~~

2. [Download and install the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli#download-and-install) (command line interface), using the instructions for your operating system

### Make sure your file is called `server.js`

Make sure your web server is called `server.js`, because that''s the name Heroku will look for, when it tries to start your app. In later lessons, we''ll show you how to call this file anything you want.

### Create a `package.json` file

`package.json` is a configuration file commonly used for JavaScript projects. You''ll learn more in a later lesson, but for now, just create it with an empty object inside:

``` {#package.json}
{}
```

### Allowing Heroku to choose the port

Right now, the port we''re binding to is always `8080`:

``` {#server.js}
const port = 8080
```

Heroku doesn''t like that though. When it runs your app, it tries to provide a specific port it wants you to use with an *environment variable* called `PORT`. Again for now, don''t worry about what environment variables are. Just know that Node provides access to them in a `process.env` object:

``` {.js}
process.env.PORT
```

That means you could use the port provided by Heroku with:

``` {#server.js}
const port = process.env.PORT || 8080
```

This assigns the value from the `PORT` environment variable -- or, if no value is set (like on your computer), we''ll fall back to port `8080`.

### Limits for unverified Heroku accounts

~~~ {.warning}
Unverified accounts (those without a credit card) can host up to 3 apps at a time. That''s plenty for our purposes. It simply means that *after a project is approved, you''ll usually want to delete the app on Heroku*. 

Here''s how:

1. Open the terminal
2. `cd` into your project directory 
3. Run `heroku destroy`
~~~

### It''s show time!

Now you''re all set up to host server-side applications for _free_ on Heroku! Just follow the instructions for the project and you''ll be live in no time. 😎', NULL, '-KappaB1hHmo94jtrO3q', 'Build a simple web server that handles _any_ URL', 'Heroku', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (219, 'js-objects', 'Use JavaScript objects to group and link information', 3, '## Grouping and looking up information

Let''s say we''re building an app for a chain of stores. Human resources wants to be able to look up information on the manager for any store. First, let''s build a simple version of the interface, using a new `select` element:

``` {.html}
<p>What information do you want about the manager?</p>

<select>
  <option value="">None</option>
  <option value="firstName">First Name</option>
  <option value="lastName">Last Name</option>
  <option value="age">Age</option>
</select>
```
~~~ {.result}
<p>What information do you want about the manager?</p>

<select>
  <option value="">None</option>
  <option value="firstName">First Name</option>
  <option value="lastName">Last Name</option>
  <option value="age">Age</option>
</select>
~~~

The `select` element allows the user to choose from one (or sometimes many) of limited options. This is useful in our case, because the information we have about the manager is limited: we only have their first name, last name, and age.

The `option` elements inside the `select` each have a `value` attribute, which is the value that will be on the `select` when that option is selected. 

Since users don''t really _input_ (as in type) anything here, we''ll also use a different event to watch changes to a `select` element: the `change` event.

~~~ {.note}
The `change` event also works on `input` and `textarea` elements, but in those cases, it only fires when the element loses focus (e.g. the user moves to another field, clicks on something else, or presses `Escape`), so it''s not as useful there.
~~~

Now let''s get started with some JavaScript:

<iframe width="100%" height="300" src="//jsfiddle.net/hcodelab/vyhjad7g/1/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

If you check out the _Result_ tab above, you can see that the very basics are working:

* we have information on the manager, stored in variables
* we know which information was requested (and currently just display it on the page)

But there''s no way to just _look up_ the requested information.

You might be tempted to introduce an `if` statement at this point:

``` {.js}
const requestedInformation = select.value

if (requestedInformation === ''firstName'') {
  result.textContent = managerFirstName
} else if (requestedInformation === ''lastName'') {
  result.textContent = managerLastName
} else if (requestedInformation === ''age'') {
  result.textContent = managerAge
}
```

There''s a problem though. This code will get more and more complicated as we handle more information. We could end up with a _huge_ `if` statement! Fortunately, there''s another feature of JavaScript that can better solve the problem.

### Looking up information in an object

Unlike strings, numbers, and most types of things in JavaScript, *objects* allow us to _structure_ information. Looking at our variables, you''ll notice a pattern:

``` {.js}
const managerFirstName = ''Eva''
const managerLastName = ''Breton''
const managerAge = 34
```

It''s all information related to the manager. When you notice this pattern, it''s a good sign that you can restructure your variables into an object:

``` {.js}
const manager = {
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34
}
```

As you can see, we define an object with curly braces (`{` and `}`), with a list of *properties* between them, separated by commas.

-- Wait, hold on a second! _Properties?_ Like `myInput.value`, `myString.length`, etc? Are you telling me that --

Yes, they are all objects (or object-like). Objects are _everywhere_ in JavaScript. And now we''ll be building our own! Back to our first object definition:

``` {.js}
const manager = {
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34
}
```

Each property has:

* a *key* (e.g. `firstName`, `lastName`, `age`)
* a *value* (e.g. `''Eva''`, `''Breton''`, `34`)

Just as keys in real life, keys in an object are what unlock the information behind them. As you saw in previous lessons, we can access properties with a dot (`.`):

``` {.js}
console.log(manager.firstName) //=> "Eva"
console.log(manager.lastName)  //=> "Breton"
console.log(manager.age)       //=> 34
```

You can also access properties with square brackets (`[` and `]`) and the name of the key as a string:

``` {.js}
console.log(manager[''firstName'']) //=> "Eva"
console.log(manager[''lastName''])  //=> "Breton"
console.log(manager[''age''])       //=> 34
```

~~~ {.note}
This works, because all keys _are_ strings. We could also have defined our object like this:

``` {.js}
const manager = {
  ''firstName'': ''Eva'',
  ''lastName'': ''Breton'',
  ''age'': 34
}
```

But we didn''t, because if our key is a valid variable name, then we''re allowed to leave out the quotes and access it with a dot -- which is just more convenient. 

Since keys are just strings though, that means we could really use _any_ strings. For example:

``` {.js}
const manager = {
  ''first name'': ''Eva'',
  ''last name!!!'': ''Breton'',
  ''AGE ¯\\_(ツ)_/¯'': 34
}
```

However, since none of these are valid variable names, we would have to access them with square brackets:

``` {.js}
console.log(manager[''first name''])     //=> "Eva"
console.log(manager[''last name!!!''])   //=> "Breton"
console.log(manager[''AGE ¯\\_(ツ)_/¯'']) //=> 34
```
~~~

This square bracket syntax can also be used with variables or any other expression that returns a string. For example, to complete our interface for displaying information about a manager:

<iframe width="100%" height="310" src="//jsfiddle.net/hcodelab/8vo1s6xa/2/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

Check out the _Result_ tab above. It''s just like a dictionary! You give the object a key (what you want to look up) and it returns a value (like a definition).

## Handling more complex structures with nested objects

There are many cases where objects have to be several layers deep. Fortunately, the value of a property can be _anything_ -- even another object. For example, if we needed to upgrade our app to look up information for multiple employees, we could instead have an object for the entire store:

``` {.js}
const store = {
  manager: {
    firstName: ''Eva'',
    lastName: ''Breton'',
    age: 34
  },
  assistantManager: {
    firstName: ''Diya'',
    lastName: ''Mehta'',
    age: 26
  }
}
```

Then to access the first name of the assistant manager, we could use multiple dots:

``` {.js}
store.assistantManager.firstName
```

Or multiple pairs of square brackets:

``` {.js}
store[''assistantManager''][''firstName'']
```

Our updated app might look like this:

<iframe width="100%" height="550" src="//jsfiddle.net/hcodelab/eb8y5qu1/2/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

It doesn''t end here either. You can nest objects as deeply as you want, with objects inside of objects inside of objects, etc, etc.

~~~ {.note}
When you need to know whether a property _exists_ in an object and don''t care what the value is, you can use our dear friend [truthy](../js-conditionals#truthy).

Here''s an example that finds out whether our store has an assistant manager:

``` {.js}
if (store[''assistantManager'']) {
  // the store has an assistant manager
}
```

Similarly, we can use a falsy check (using `!`) to find out whether our store does _not_ have an assistant manager:


``` {.js}
if (!store[''assistantManager'']) {
  // the store does not have an assistant manager
}
```
~~~

## Updating, adding, and removing properties

### Changing the value of existing properties

You''ve actually done quite a bit of this already. When writing code like:

``` {.js}
myElement.textContent = ''new content''`
```

You''re updating a property. It''s that easy. You can also use the square brackets syntax:

``` {.js}
myElement[''textContent''] = ''new content''`
```

If you are using variables, you can use the square brackets syntax as well:

``` {.js}
const key = ''textContent''
const value = ''new content''
myElement[key] = value
```

### Adding new properties

You''ll be happy to hear that adding a new property is just as easy. Going back to our manager example:

``` {.js}
const manager = {
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34
}
```

Adding a new property for the year they started can be done with:

``` {.js}
manager.yearStarted = 2008
```

And again, the square brackets syntax works just as well:

``` {.js}
manager[''yearStarted''] = 2008
```

### Deleting properties

To delete a property, you can use the `delete` keyword. For example, if the manager requests that we delete her age from the system, we could do so with:

``` {.js}
delete manager.age
```

And yes, the square brackets syntax also works:

``` {.js}
delete manager[''age'']
```

## Linking objects together

Objects are a bit _different_ from strings, numbers, `true`, and `false`. To explain how, let''s walk through an example. 

Let''s say a user starts a new game:

``` {.js}
const highScore = 0
const pointsScored = 0
```

Since they''ve never played before, their high score is 0. They''ve also just started, so they haven''t scored any points yet.

Then they swipe a watermelon, which gives them 50 points! 💫 🍉

``` {.js}
pointsScored = 50
```

Since `pointsScored` is larger than `highScore`, we''ll update `highScore` with their new personal best:

``` {.js}
highScore = pointsScored
```

Then they lose, because they swiped the wrong watermelon and it exploded. 💥 🍉 💥

Now they''re back to 0 points in a new game:

``` {.js}
pointsScored = 0
```

So what will be the value of `highScore` now? Fortunately, still 50, even though we set `highScore` to the value of `pointsScored` earlier.

This is a very good thing, because we don''t want the `highScore` to reset just because the user started a new game. That would completely defeat the purpose of a high score!

### References to objects

Why does this work? In the code below:

``` {.js}
a = b
```

The _current value_ of `b` is what''s stored in `a`. This is how assignment works for most values, like numbers, strings, and booleans.

But objects work differently.

If `b` is an object, then _a reference to the object_ will be stored in `a`. Let''s dive into another example to really understand what that means. We''ll define a variable called `manager`, just as before, then we''ll assign `manager` to a new variable called `eva`:

``` {.js}
const manager = {
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34
}

const eva = manager
```

Our manager Eva just had her birthday, so we''ll update her age:

``` {.js}
manager.age = 35
```

Now here''s the difference. Even though we updated `manager.age`, inspecting `eva.age` will reveal that it''s also now 35:

``` {.js}
console.log(eva.age) //=> 35
```

This also works the other way around. Any changes to the object in `eva` will also update `manager`. That''s because both `manager` and `eva` are storing references to _the exact same object_. It''s just two names for the same thing.

If this is blowing your mind, remember that objects are like anything in the real world that can have many names, like people. For example, let''s say Michael has a husband named Robert. If Robert gets a tattoo, what would you answer if someone asked, "Does Michael''s husband have a tattoo?" You''d say yes, because Michael''s husband and Robert are the same person.

Here''s what that conversation looks like in JavaScript:

``` {.js}
const robert = {
  hasTattoo: false,
  wantsTattoo: true
}
const michael = {
  husband: robert,
  hatesTattoos: true
}

// Michael''s husband (Robert) gets a tattoo
michael.husband.hasTattoo = true

console.log(robert.hasTattoo) //=> true
```

But what if Michael really, really didn''t like the tattoo, but Robert refused to get rid of it? It could destroy their marriage! After the divorce, Michael might marry Felipe, who''s probably a better match for him:

``` {.js}
const felipe = {
  hasTattoo: false,
  wantsTattoo: false
}

michael.husband = felipe
```

Note that this does _not_ change the `robert` object. We''ve simply updated `michael.husband` to point to a different object: `felipe`.

### Building two-way relationships between objects

When we created a nested object for our store, the properties inside our `store` object had references to other objects (the `manager` and `assistantManager` of the store). Sometimes, relationships are simple enough that you can declare it all in one big tree, like we did earlier:

``` {.js}
const store = {
  manager: {
    firstName: ''Eva'',
    lastName: ''Breton'',
    age: 34
  },
  assistantManager: {
    firstName: ''Diya'',
    lastName: ''Mehta'',
    age: 26
  }
}
```

This object makes an assumption though -- that we always start at the `store`. What if you''re the manager and you want to find out where you work? Or who your assistant is? All you can see is this:

``` {.js}
{
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34
}
```

So you''re stuck. To build up these relationships, we first need to assign each object to individual variables. You might start with:

``` {.js}
const manager = {
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34,
  assistant: assistantManager
}

const assistantManager = {
  firstName: ''Diya'',
  lastName: ''Mehta'',
  age: 26,
  boss: manager
}
```

There''s a problem though, when we get to:

``` {.js}
assistant: assistantManager
```

`assistantManager` will be undefined at this point, because we don''t declare that variable until 3 lines later. Fortunately, there''s a solution. Declare the variable for each object first, with simple properties (i.e. those with string, number, or boolean values). _Then_ set the relationships.

``` {.js}
// Our store begins as an empty object, because it has
// no properties other than relationships.
const store = {}

const manager = {
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34
}

const assistantManager = {
  firstName: ''Diya'',
  lastName: ''Mehta'',
  age: 26
}

// Set the relationships for the store
store.manager = manager
store.assistantManager = assistantManager

// Set the relationships for the manager
manager.store = store
manager.assistant = assistantManager

// Set the relationships for the assistant manager
assistantManager.store = store
assistantManager.boss = manager
```

Now we can ask any question about the relationships between these objects, starting from any one of them. For example, "What store does the assistant of the manager work at?"

``` {.js}
manager.assistant.store
```

## Dealing with nonexistent properties

In real applications, we have to deal with *edge cases*. Edge cases are what _could_ happen, even if it''s inconvenient for us. For example, in our app that looked up employee information... we, uh... well, we cheated a bit. 😬

We made sure the employee `select` didn''t have an empty option, like this one:

``` {.html}
<option value="">None</option>
```

Let''s say we _did_ add it though. What would happen at this line below when `None` is selected?

``` {.js}
const requestedInfo = store[employeeSelect.value][infoSelect.value]
```

`employeeSelect.value` will be an empty string (`''''`). Since `''''` isn''t a key in our `store` object, `store[employeeSelect.value]` will be `undefined`.

At this point, it doesn''t even matter what `infoSelect.value` is, because `undefined[ANYTHING]` will always cause an error:

``` {.output}
Uncaught TypeError: Cannot read property of undefined
```

To deal with `undefined`, you can use an `if` statement to check if a matching employee was found:

``` {.js}
const employee = store[employeeSelect.value]

if (employee) {
  const requestedInfo = employee[infoSelect.value]
}
```

We can even take this a step further. How about if the `employee` or `requestedInfo` are undefined, we update the `result` element with instructions:

``` {.js}
const employee = store[employeeSelect.value]
if (employee) {
  const requestedInfo = employee[infoSelect.value]
  if (requestedInfo) {
    result.textContent = requestedInfo
  } else {
    result.textContent = ''Select the requested information.'' 
  }
} else {
  result.textContent = ''Select an employee.''
}
```

Now our final program is:

<iframe width="100%" height="750" src="//jsfiddle.net/hcodelab/2a79s641/2/embedded/js,html,result/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0"></iframe>

## Using objects with `localStorage`

You can also save objects in `localStorage`, but just like with numbers, booleans, `null`, and `undefined`, you have to do a little extra work. 

For example, going back to our `manager` object:

``` {.js}
const manager = {
  firstName: ''Eva'',
  lastName: ''Breton'',
  age: 34
}
```

If you try to save it with:

``` {.js}
window.localStorage.setItem(''manager'', manager)
```

Then guess what we''ll find when we try to retrieve this value?

``` {.js}
window.localStorage.getItem(''manager'') //=> ''[object Object]''
```

😲 &nbsp;What?! The string `''[object Object]''` doesn''t include _any_ of the information we want to save! Fortunately, JavaScript provides a method to create more useful strings from objects:

### *`JSON.stringify`*

If we run:

``` {.js}
JSON.stringify(manager)
```

We''ll instead get:

``` {.js}
''{"firstName":"Eva","lastName":"Breton","age":34}''
```

There''s all our data! _That''s_ a string you can save to `localStorage`. So whenever you want to save an object, just remember these steps:

``` {.js}
// 1. Manually stringify the object
const stringifiedManager = JSON.stringify(manager)

// 2. Save the stringified version
window.localStorage.setItem(''manager'', stringifiedManager)
```

~~~ {.note}
In case you''re curious, *JSON* stands for _JavaScript Object Notation_. That''s just a fancy way of saying, "a standard way of representing objects". 

`JSON.stringify` converts objects into the JSON format, which is not only useful for saving data in `localStorage`, but also for communicating with servers, as you''ll learn about in a later lesson.
~~~

Now our object is saved as a string, but... how do we turn the string back into an object later?

### `JSON.parse`

When you have an object that''s been stringified, so that it can be saved in `localStorage`, you can turn it _back_ into an object with `JSON.parse`:

``` {.js}
// 1. Retrieve the stringified object from localStorage
const stringifiedManager = window.localStorage.getItem(''manager'')

// 2. Convert the stringified object into a real object
const manager = JSON.parse(stringifiedManager)

// 3. Use the object normally
manager.firstName //=> ''Eva''
```', NULL, '-KaprwTCydF6WbT4W3KQ', 'Build an app that can tell jokes, learn new jokes, and most importantly: forget bad jokes 😅', 'Surge', 3);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (205, 'css-stealing-styles', 'Inspecting and prototyping CSS with Chrome''s devtools ', 1, '## Automatically catching errors and style violations

Very soon we''ll be writing more complex CSS and like we did with HTML, we''re going to use our editor to help us know when we''ve made mistakes. VS Code comes with a CSS linter so we don''t have to install a new extension, but we do need to tell VS Code which mistakes to look for.

To configure VS Code''s CSS linter, follow these steps:

1. 

  Open your settings with `Cmd`+`,` (macOS) or `Ctrl`+`,` (Windows/Linux)
  
2. 

  Click the icon in the top right corner of VS Code''s settings that shows the text "Open Settings (JSON)" when you hover your mouse over it, as shown in the image below: ![VS Code Open Settings (JSON)](https://i.imgur.com/OfrOnGB.png)

3. 

  In the file that opens, add the following lines to the end of your configuration, on the line immediately before the last `}`:

  ``` {.json}
  "css.lint.vendorPrefix": "error",
  "css.lint.duplicateProperties": "error",
  "css.lint.emptyRules": "error",
  "css.lint.zeroUnits": "error",
  "css.lint.hexColorLength": "error",
  "css.lint.argumentsInColorFunction": "error",
  "css.lint.unknownProperties": "error",
  "css.lint.important": "error",
  "css.lint.float": "warning",
  "css.lint.idSelector": "warning"
  ```

3. 

  Restart VS Code

That''s it. You should now see helpful warnings in all future CSS, like this:

![CSS linter expected no unit for zero error](https://i.imgur.com/o3eOYQf.png)

If you''re curious about what all of these rules mean, Microsoft explains each of them in the [Customizing CSS, Sass and Less Settings](https://code.visualstudio.com/Docs/languages/CSS#_customizing-css-sass-and-less-settings) documentation.

~~~ {.warning}
Your instructors will make sure any CSS you submit passes these rules and reject anything that doesn''t. Save yourself (and your instructors) time by using these linters to write clean code and develop good coding habits!

In future lessons we''ll introduce even more strict linting rules for CSS. Master the basics now so you''ll be ready when it''s time to take your CSS to the next level. 🙂
~~~

## Inspecting elements with Chrome''s devtools

What''s nice about the web is if you see something you like, you can always take a closer look. See a design that strikes your fancy? Just take it! You''ve learned how to do this with color pickers and page rulers, but how would you capture the shadow on the circle below? And how did we make a circle?!

~~~ {.result}
<div style="
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: #9caabf;
  box-shadow: 3px 3px 30px #4d5d75;
"></div>
~~~

Clearly, a color picker isn''t enough. There are a lot of different colors in that shadow and... we don''t even know how to make a shadow yet. We could Google something like "how to create a shadow in css" and probably find something, but wouldn''t it be great if we could just look at the exact CSS _this site_ uses?

![Go ahead I''m listening dog](https://i.imgur.com/3WlJIlH.jpg)

In Chrome, scroll back up to that circle, right-click on it, then click _Inspect Element_. You should see something like this at the bottom or side of your browser window:

![Chrome console](https://i.imgur.com/b1IWkkQ.png)

These are the *[Chrome devtools](https://developer.chrome.com/devtools)*. On the left, you can see the page''s HTML, with the element you just right-clicked on selected. On the right, you can see the CSS being used on this element. Now let''s look at that CSS:

![CSS on Chrome devtools](https://i.imgur.com/HvB4kNd.png)

We''ve seen `width`, `height`, `border-radius` -- oh, but wait. It has a value of `100%`? What is _that_ doing?

Guess what? You can play with it live in the browser! (Don''t worry, any changes you make will reset the next time you refresh.)

![Manipulating border-radius in the Chrome console](https://i.imgur.com/S0E6KUs.gif)

As you can see, as soon as we remove `100%` for the `border-radius`, our circle changes into a square. You could do the same kind of experimentation on this new `box-shadow` property, to see how it works.

## Manipulating values

Let''s bring back our circle:

~~~ {.result}
<div style="
  width: 100px;
  height: 100px;
  border-radius: 100%;
  background-color: #9caabf;
  box-shadow: 3px 3px 30px #4d5d75;
"></div>
~~~

And then inspect it again. When inspecting an element, you can not only type in new values, but also more organically _play_ with them by clicking on the value, then *scrolling up or down* with your mouse or the up/down arrow keys to make the value larger or smaller.

![Manipulating number values in Chrome console](https://i.imgur.com/39xM5TK.gif)

Being able to play with values like this is not only great for prototyping, but it allows us to make _discoveries_. Playing with the value of `border-radius`, we stumbled upon something: the value of `100%` is totally unnecessary! 

They may as well have put `100000%` -- it makes no difference. When we made it smaller, there was no visual change until dropping below `50%`. Whoever coded this example doesn''t seem to understand how `border-radius` actually works. 😉

### Manipulating colors

If you click on the square next to a color, you can also start playing with that value in a color map and the affected element(s) will change _live_:

![Manipulating color values in Chrome console](https://i.imgur.com/cfto4YK.gif)

While this is open, you''ll also be able to pick out colors from the page by clicking on them. This works as long as the color picker icon is turned on: 

![Color picker icon](http://i.imgur.com/XS38RqB.png) 

It''s blue when it''s on, gray when it''s off.

### Manipulating more complex values

As you can see, `box-shadow` has _a lot_ going on. Its value includes a few pixel values, then a color. To figure out what each part does, you could play with them the same way you played with other values:

![Manipulating box-shadow values in Chrome console](https://i.imgur.com/LvIn2qu.gif)

For some complex properties though, there''s sometimes an even better way. If you click on the purple icon to the left of the `box-shadow` value, it''ll open advanced controls made specifically for prototyping shadows:

<video draggable="false" playsinline autoplay loop style="max-width: 65%; margin: 0 auto; display: block; padding:20px">
  <source type="video/mp4" src="https://i.imgur.com/5Wk2bfG.mp4">
</video>

Now we actually get labels, fancy slider controls, _and_ it showed us two new options: type and spread. All of these we can play with _live_, then when we''re done, just copy the CSS it generated into your CSS file so it doesn''t get lost on the next refresh.

## Adding/removing properties

Prototyping is more than just changing the values of existing properties. Sometimes, you need to add new properties or completely disable existing ones, like in this note:

~~~ {.result}
<p class="note">Hello, I''m a note!</p>
~~~

We''re wondering what it would look like with a very subtle `box-shadow`, no `border`, and no `border-radius`. Let''s inspect it!

![Adding new styles in Chrome console](https://i.imgur.com/RGxNrzO.gif)

### Adding a property

As you can see, we can click on an open area in between curly braces (`{` and `}`) to add a new property. Once we''ve typed the name of the property, we can press the tab key to enter its value, then simply press enter or click somewhere else to activate the style.

If we add properties to `element.style` at the top, they will _only_ affect that specific element. If we add the properties to one of the listed selector groups from our CSS, they will apply to any selected elements.

Don''t forget to try this out yourself! Add some properties to elements on this page -- or any other page on the Internet.

### Removing a property

Also demonstrated above, you''ll see that when hovering over a property in the devtools, a checkbox appears. Simply uncheck the box to disable the property. You can check it again at any time to re-enable it.

## Prototyping states (e.g. `hover`, `focus`)

There''s a problem with prototyping states like `hover`, common on links:

~~~ {.result}
<a>Hello, I''m a link!</a>
~~~

You can hover over a link to see what it looks like, but as soon as you move your mouse away from it, it''s back to non-hovered styles and you can''t actually see the changes you''re making.

That''s why the devtools include a `:hov` button to change states. To force an element to appear the way it will when hovered, just select `:hover` and add your styles:

![Change element states in Chrome console](https://i.imgur.com/3isvPGD.gif)

The `focus` state is also especially useful. It changes the appearance of `input` and many other elements when they''re focused on and ready for user input.

On the `input` element below, you can click inside it to see the border change color when focused:

~~~ {.result}
<input>
~~~

## More exploration of how CSS works

### Really understanding `padding`, `margin`, and others

As you may have learned from the previous CSS lesson, it''s not always easy to figure out the role `padding`, `margin`, `border`, `width`, `height`, `line-height`, and other properties might play in the layout of a page.

Fortunately, there''s the _Inspect Element_ button at the top-left of the devtools (it looks like a box with a mouse cursor on it). This allows you to move your mouse around the page and on every element, you''ll see highlighting with the:

* 

  content <span style="
    padding: 5px;
    background-color: #9CC1E4;
  ">blue</span> (including `width`, `height`, and `line-height`)

* 

  padding <span style="
    padding: 5px;
    background-color: #C3DEB7;
  ">green</span> 

* 

  border <span style="
    padding: 5px;
    background-color: #FDDD9B;
  ">orange</span>

* 

  margin <span style="
    padding: 5px;
    background-color: #F9CC9D;
  ">red</span>
  
No more guessing! You not only have access to _exact_ pixel dimensions, but also a visual guide to how each element is achieving the spacing it uses:

<video draggable="false" playsinline autoplay loop style="display: block; margin: 0 auto; padding:20px">
  <source type="video/mp4" src="https://i.imgur.com/Buw9miq.mp4">
</video>

### Customizing your experience

You can also resize any part of the devtools and move them from the bottom to the side of your screen, when that''s more convenient.

<video draggable="false" playsinline autoplay loop style="display: block; margin: 0 auto;padding:20px">
  <source type="video/mp4" src="https://i.imgur.com/d0NYGJs.mp4">
</video>

And there are even more settings to change exactly how the devtools work for you! For example, you may have noticed that when we browsed elements to see their `padding`, `margin`, and `border`, there were lines extending from those elements, helping us see how they match up with other elements on the page.

If you don''t see those lines with _your_ devtools, you may need to check the _Show rulers_ setting:

![Chrome Devtools settings](https://i.imgur.com/v3PATTt.gif)
', NULL, '-KbBJMGHWOLpg-xedvDK', 'Build a prototype page (i.e. simple example of how it will look, without making it work) for a new search engine', 'GitHub Pages', 2);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (200, 'css-frameworks', 'Use CSS frameworks to structure and style a website', 3, '## What''s a CSS framework?

Let''s be honest. An unstyled page on the web looks... not great. But designing a decent look from scratch? It can take a while, especially to get it working in all browsers. And at this point, you may not even know how to write any CSS yourself.

This is where a *CSS framework* comes in. It''s a collection of CSS code that you can include in your projects to make them look pretty good without a lot of work. In most cases, many other developers have used this code in their own projects and contributed back with improvements and bug fixes.

In a previous lesson, you got your first taste of what''s possible with the Skeleton CSS framework. We didn''t do much with it though. We just included it in our page with a `link` element, then everything immediately looked a little more polished.

To really take full advantage of a CSS framework, you need to use the *classes* it provides.

### The `class` attribute

Every HTML element can have a `class` attribute, which is mostly used to change the way an element looks and behaves. Here''s a simple example with the CSS used on the page you''re looking at now:

``` {.html}
<a class="button" href="https://msu.edu/" target="_blank">
  MSU Homepage
</a>
```
~~~ {.result}
<a class="button" href="https://msu.edu/" target="_blank">
  MSU Homepage
</a>
~~~

By adding a single class, we''ve changed how the link appears. All the text has been uppercased, bolded, and it''s been given a faint border that gets darker when you hover your mouse over the button.

You can even add _many_ classes to an element, separating them by spaces:

``` {.html}
Visit the 
<a class="button primary inline">
  MSU Homepage
</a>
to learn more.
```
~~~ {.result}
Visit the 
<a class="button primary inline">
  MSU Homepage
</a>
to learn more.
~~~

The `button` class made the link more button-like, `primary` made it a different color to better match our branding, and `inline` made it a bit smaller so that it fits better next to other text.

~~~ {.warning}
Note that without CSS, none of these classes would do anything. They only work on this website because in _our_ CSS, we''ve defined that any elements with the `button` class should look that specific way.

Also, there''s nothing special about the names we''re using here. They could be _anything_. If we wanted to, we could have named the `button` class `btn` or `super-magic-clicky-thing` instead. We could even name it `🎈💥 😭` (yes, emoji are valid in class names), although it would probably be difficult to remember what the heck that class is supposed to do.

<blockquote>
  "So... the balloon pops and then someone cries?"
</blockquote>
<blockquote>
  "You got it! Because for some people, it really <em>presses their buttons</em> (like makes them angry) when someone pops a balloon around them. So that''s how we style buttons at our startup. Welcome aboard."
</blockquote>
~~~

## The importance of learning to learn

So when you get started with a new CSS framework, how do you learn to use it? What classes does it provide? What do they do?

It''s actually pretty unusual for people to learn about this stuff in school -- and even if they did, that knowledge wouldn''t last long. The popular frameworks may be completely different in 5 years and ideally, your career will be much longer than that!

That''s why we''re _not_ teaching you a specific framework here. Instead, we''ll walk through how to _learn to use_ CSS frameworks. First, we''ll walk through how you might learn more about the Skeleton CSS framework, then you''ll apply these skills and resources to learn a completely different CSS framework for the project.

## Reading documentation

*Documentation* (also referred to as *docs*, *manuals*, or on the terminal, *man pages*) is just a place where the people who wrote some code explain how to use it. Usually, you''ll read docs on the website dedicated to that project. Sometimes, they''re extremely well-organized and clearly written. Sometimes not. That''s why navigating and reading docs is an important skill.

### The benefits of reading docs

Sometimes, you can sort of figure out how things work by just playing around. Change some code, see what happens, repeat. This can be a valuable learning strategy, but it can also take a lot of time and you''ll miss things. When you learn to use something by reading the docs, you:

* 
  
  *Learn best practices*: Just as there are multiple ways to say the same thing in a spoken language, there are multiple ways to _do_ the same thing in a programming language. Docs often helps you find the _best_ ways, that are least likely to cause confusion or other problems in the future.

* 
  
  *Avoid common problems*: In the terminal, the fact that spaces have to be escaped with `\\` causes confusion for a lot of people. But because you carefully read the first lesson, _you_ know all about that. Though you may forget sometimes, you''re better able to deal with that situation.
  
* 
  
  *Ask better questions*: When you need help from a real person, reading the docs _first_ will help you ask better questions. You learn the names for things, so you can describe the situation more clearly. Since you''ll have also avoided the most common problems, you''ll often find that people are more willing to help you, because your problems are simply more interesting!

Related to asking better questions: many people on the Internet will _insist_ you read the docs first, before they help you. In these situations, there''s an expression you might see online sometimes: *RTFM*. It stands for Read The Freakin'' Manual.

[![RTFM](https://imgs.xkcd.com/comics/rtfm.png)](https://xkcd.com/293/?.png)

### Strategies for reading docs

#### Finding the docs

When searching for the Skeleton docs, you''ll probably find that Googling `skeleton` just gives you a lot of this:

![Skeleton](https://i.imgur.com/zlpoxn9.png)

Not very helpful. That''s why it''s important to provide as much context as possible. You may even have to try several variations until you find the right link. For example:

* `skeleton docs`
* `skeleton css docs`
* `skeleton css documentation`
* `skeleton css framework getting started`
* `skeleton css framework guide`

Eventually, you should find your way to [getskeleton.com](http://getskeleton.com/).

#### Getting started

Many docs will include a section called _Getting Started_, _Introduction_, _Intro_, or _Guide_. Since docs can often be very long, this is often the best place to start learning when you''re new and want to master the basics.

#### Searching documentation

When you''re trying to do something very specific, like make links look like buttons, it can often help to start with a more specific search. Sometimes, docs will have a search box built into the site. Even if it exists though, it might not work very well. If that''s the case, you can try a site-specific search on Google by adding `site:[URL]` to the end of your search term, such as `buttons site:getskeleton.com`.

If the results take you to a page that''s very long, you can then use `Cmd`+`F` on macOS or `Ctrl`+`F` everywhere else to start a text search. In this case, try searching for `button`. The first instance of the word/phrase may not be want you want, but you should eventually find what you were looking for -- and much faster than if you scrolled through the entire page, scanning with your eyes.

#### Searching other resources

We mentioned that sometimes documentation isn''t very well-written. They may leave out important details or just phrase things confusingly. If you find this to be the case, you can try Google searches such as:

* `how to X with skeleton css framework` (`X` being what you''re trying to do)
* `skeleton css trying to X, but Y` (`X` being what you''re trying to do and `Y` being what''s happening instead)

There are also other websites, like [Stack Overflow](http://stackoverflow.com/), where programmers ask each other programming questions. If the results you''re finding aren''t helpful, try using Stack Overflow''s built-in search or a site-specific search on Google (e.g. `how to X with skeleton css framework site:stackoverflow.com`). 

You can try site-specific searches with _any resources_ you find, like a great blog dedicated to exploring the Skeleton CSS framework.

#### Google as you go

Let''s say you''re around 30 and a younger friend tells you an upcoming event will be _lit_. You look it up on Urban Dictionary and the definition is _turned up or popping_ -- two other phrases you aren''t familiar with.

This can be very discouraging! And it also happens when learning about code. Sometimes, you have to Google a few layers deep to find out what something means.

Other times, you can just skip over stuff you don''t understand. For example, the installation instructions for a framework may give you many different options, such as:

* Download
* Download source
* Use from a CDN
* Install with NPM
* Install with Bower
* Install with Composer
* Compile with Grunt
* Compile with Browserify
* Compile with Webpack

At this point, you may be ready to just give up. Do you really have to understand _all of these_ before even starting? The answer is: no! When presented with several options, just stick with the one(s) you understand. In this case, you probably understand _Download_, so that''s probably a good place to start. If you run into issues and feel overwhelmed, you can always ask a friend, instructor, or random person on the Internet for help.

## Exploring the Skeleton docs

Using the skills from the last page, we should be able to find a section in the Skeleton docs all about buttons:

![Skeleton.css buttons docs](https://i.imgur.com/3a7jrxh.png)

As you can see, the docs introduce a few classes, what they do, and what elements they can be used on. Then they show you the resulting buttons and examples of real code using these classes. 

In the examples, you may even see some elements you haven''t been introduced to yet! If this happens and you want a quick introduction to an element, we recommend searching the [*Mozilla Developer Network*](https://developer.mozilla.org/en-US/search?q=) (a.k.a. *MDN*) for more information. For example, to learn more about the `button` element, you could Google `mdn button element`.

### Play right away

As you''re reading the docs, it might be hard to tell if you _really_ understand something. That''s why we recommend setting up a simple demo project on your computer as soon as possible, then playing with each new feature as you read about it.

If you haven''t already, do this now by either:

* [Downloading Skeleton](http://getskeleton.com/) into a project folder and linking to the `.css` file with a `link` element, or
* Linking to Skeleton''s `.css` file the same way we have in previous projects. To provide a little more information about this method, we used a *CDN*, short for Content Delivery Network. CDNs are websites that are willing to host public code for us, so that we can just link to it. If the website for a framework doesn''t list a link to a CDN, you can Google the name of the framework, plus `cdn`.

Playing around with different kinds of buttons, you might find yourself writing something like:

<iframe width="100%" height="200" src="https://jsfiddle.net/chrisvfritz/y7vc1wjr/embedded/html,result/dark?menuColor=214633&accentColor=FFF&fontColor=FFF" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Generic elements (`div` and `span`)

While browsing the docs of CSS frameworks, there are two new elements you''re likely to keep seeing: `div` and `span`. Unlike the other elements you may have seen so far, these elements don''t say anything about the content inside of them. It''s HTML''s equivalent of vaguely saying, "Here''s some stuff." The difference between them is:

* `div` is a _block_ element. If you remember from a previous lesson, this means it takes up the full width of its parent, similar to `h1`-`h6` and `p`.
* `span` is an _inline_ element. This means it''s only as wide as its content, similar to `strong` and `em`.

These elements only gain meaning with the classes we add to them. They should never be used where a more specific element (like `h2` or `strong`) exists, but they can be useful for styling things there are no elements for, like rows and columns in a multi-column layout.

Speaking of rows and columns...

### Discovering "the grid"

As you explore the _Intro_ section of the Skeleton docs, you''ll see information about a *grid system*. This is a really useful feature of many CSS frameworks. Grid systems are collections of classes we can use together to organize content into multiple columns.

Here''s a simple example:

<iframe width="100%" height="700" src="https://jsfiddle.net/chrisvfritz/mjy460ce/embedded/html,result/dark?menuColor=214633&accentColor=FFF&fontColor=FFF" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

When you click on the _Result_ tab of that embedded content, you''ll see a heading, then two equal-sized columns below it. If you make the page narrower, you''ll see that these columns even "collapse" on top of each other on smaller screens. That means they won''t look cramped on smaller tablets and smartphones!

## Exploring a new CSS framework

It''s time. You now have the skills to explore a new CSS framework and figure out how to use it. In the project, you''ll build a webpage using Bootstrap, which is probably the most popular CSS framework right now. It includes many more features than Skeleton and much more expansive documentation.

We won''t even be providing a link to the website, but that doesn''t mean you''re completely on your own. If you get stuck and need help, you can still ask as many questions as you''d like, just like professional developers do when _they_ get stuck.', 'Added keyword "grid" to the 2-column/1-column criterion to help students find the appropriate page in the Bootstrap docs 10/22/18 - Erik Gillespie
Changed to Bootstrap 4 and added a display utility requirement 10/16/18 - Katie Fritz', '-KaJYp2Piz1gDFp1twXJ', 'Build a homepage for an imaginary company (you can make up the product/service they offer)', 'GitHub Pages', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (221, 'js-serving-content-with-express', 'Serving content using Node + Express', 3, '## What we''ll be learning

In this lesson we''re going to learn how to make dynamic sites using our first server-side framework, Express.

We''ve used CSS frameworks in this class like Bootstrap and Skeleton to save us time and offload some code we would otherwise have to write ourselves. Express is similar, but it allows us to write server-side javascript in Node with less work upfront.

We''ll also be using our first *templating engine*: EJS. Templating engines allow us to generate more HTML with less code. They make our sites more flexible and dynamic, and let us more easily move data between the front-end and back-end of our site.

These are some of the most important building blocks of writing server-side web applications. By the end of the lesson, you''ll have the knowledge to use them in your own projects. You ready?

![Lets go](https://i.imgur.com/SybXMrc.png)

## Using Express

Let''s get started right away by setting up a simple web server with Express. If you remember the first Node lesson, we''ll be doing the exact same thing here, but this time we''ll be using Express.

~~~ {.note}
#### 💻 Follow along

Go ahead and create an empty project folder on your computer now so you can follow along with the examples.
~~~

### Create a `package.json` file

Before we can add a dependency like Express to our project and start using it, we need a `package.json` file to track the dependencies.

To create that file from scratch, use the following command:

``` {.sh}
npm init
```

This will ask you for some basic information about our project like the name, version, description, entry point, author, and license. If you press `Enter` without providing a value, a sensible default value will be provided.

Go ahead and do this now and press `Enter` for all of the prompts, providing values when you want, then make sure there is a `package.json` file in your project directory.

### Creating a web server in Express

Next, let''s make sure we have Express in our project. From your project directory, run:

```{.sh}
npm install --save express
```

This will create a `node_modules` folder with your `express` package nested inside and a `package.json` file. It will look something like this:

``` {#package.json}
{
  "name": "js-serving-content-with-express",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "express": "^4.17.1"
  }
}
```

~~~ {.note}
#### Installing dependencies

Congratulations, you just installed your first runtime dependency! 🎉

By using `npm install --save` to install Express, the `express` package was added to `dependencies` instead of `devDependencies`. We did this on purpose because Express is used in our project _while it''s running_.

If the code that you write needs to use a package while it''s running, make sure to use `npm install --save` to install it.
~~~

Now let''s make a file called `server.js` in the root of our project and add some code to our server:

```{#server.js}
const express = require(''express'')
const app = express()
const port = process.env.PORT || 8080

app.get(''/'', function (request, response) {
  response.end(''suuuuuuup'')
})

app.listen(port)
```

There you have it, a web server in 9 lines of code. To test that it''s working:

1. Run `node server.js` in your terminal
2. Go to `localhost:8080` in your browser

If you want to add more pages, you can add more routes by calling `app.get` again (remember to restart your server when you''re done):

``` {.js}
app.get(''/about'', function (request, response) {
  response.end(''Ah, where to begin...'')
})
```

### Static and dynamic sites

At this point, it may seem kind of tedious to set up every new route with an `app.get` function. Before learning Node we didn''t have to manually set up all of our routes, so why do we have to now?

Up until now, we''ve only been creating *static sites*. A static site is one where the website and the server don''t _really_ have to communicate much with one another. The server is only there to serve up the correct pages when a user visits the site.

Now we''re building *dynamic sites*. Dynamic sites can change each time you visit a page. This is because what the user sees on the screen is often built with data from a number of different places. The data gets passed through functions and a server creates a completely unique page right then and there.

## Templating

So... printing text out on a page is cool and all, but please can we start using HTML again? Well all right, I suppose. 😜

There is one catch.

### EJS: Your first templating syntax

Up until now, we''ve been writing plain old HTML. Have you been enjoying it? Well, it''s time to ascend to a higher plane of markup: templating. We''ll be using a template engine called *EJS*.

EJS stands for *Embedded JavaScript*, and it allows you to dynamically add HTML and other content directly to a page _on the server_. It''s great to use a template engine for a couple of reasons:

#### 1. Less duplicate code

No more copying and pasting changes across files. If you use the same header on every page, you can write that header in its own file and dynamically add it to all of your other pages. Those reusable snippets are known as *partials*, by the way, and they will save you a lot of time. 😉

#### 2. Less concatenation

Remember this?

``` {.js}
''<h1>Hi '' + document.getElementById(''name'').value + ''</h1>''
+ ''<p>'' + document.getElementById(''text'').value + ''</p>''
```

![This is fine](http://i.imgur.com/c4jt321.png)

Pretty painful, wasn''t it? You can do the same thing, _much_ more easily with templating. You can load data from external sources (a database, an API, another website, etc.) and insert that data directly into your HTML.

~~~ {.note}
If you want to learn more about EJS, they have a brief [Getting Started Guide](http://ejs.co/#install). There''s also a [playground](https://ionicabizau.github.io/ejs-playground/) that lets you try out EJS right in your web browser!
~~~

## Rendering your views

Views?? What''s that?

When making dynamic sites, we often call the part of the site that is rendered to the browser the *view*. The code written on the server-side is often called the *controller*, and any dynamic data added to our view is often called the *model*.

In this case, we have no model, `server.js` is our controller (though the controller can be more than one file), and the view is what we see when we go to `localhost:8080/`. There''s not much to look at right now, let''s make some content.

### Install EJS

Before you use EJS, there are a few things you have to do. First things first, add the `ejs` package to your project:

```{.sh}
npm install --save ejs
```

After installing the `ejs` package, our `package.json` file should look like this:

``` {#package.json}
{
  "name": "project-name-goes-here",
  "version": "1.0.0",
  "dependencies": {
    "ejs": "^3.0.1",
    "express": "^4.17.1"
  }
}
```

~~~ {.warning}
Make sure the version of `ejs` in your `package.json` file is at least `3.0.0`. The examples in this lesson should work for EJS 3.0, but they may not work for older versions of EJS 2.0.
~~~

Now tell Express that you want to use EJS as your template engine by adding this line to `server.js` -- after you define the `app` variable and before you call `app.get`:

```{#server.js}
app.set(''view engine'', ''ejs'')
```

This will allow you to use EJS when you set up the routes for your pages. We''ll get to routes in a little bit. First, let''s organize our files.

### Set up your files

The first thing we''ll have to do before we pull in any HTML from separate files is add a few new directories. Create a `views` directory in your project root. This is where Express looks for view files by default.

You could go ahead and create view templates right in the `views` directory, but we recommend splitting up your templates into whole-page templates and partials. Create two new directories within `views`: `partials` and `pages`. We''ll put full pages in `pages`, and we''ll put individual parts (header, footer, etc.) in `partials`.

Now create an `index.ejs` file in your `pages` directory, and a `header.ejs` file in your `partials` directory (we''ll fill them in soon). Your full project tree will look something like this:

![Express project directory structure](https://i.imgur.com/qX8CuuN.png)

### Build and display the page

Now that you have your views directory set up, lets connect the `/` route on the server to your `index.ejs` file. Update your route for `/` in `server.js` to this:

```{#server.js}
app.get(''/'', function (request, response) {
  response.render(''pages/index'')
})
```

So now, instead of outputting plain text with `response.end`, we''re rendering a EJS template file. Specifically, `pages/index` tells Express to use the `views/pages/index.ejs` template.

Now we can put HTML in `index.ejs` as if it were an HTML file:

``` {#index.ejs}
<title>Express + EJS</title>

<h1>🎉 It''s working! 🎉</h1>
```

Now if you run `node server.js` in a terminal, you should see "It''s working!" in your browser window.

![EJS templates are working](http://i.imgur.com/Lk10xIo.png)

You probably noticed that EJS looks a lot like HTML. You can write all your future EJS code in plain HTML if you''d like, but once you discover some of the other features EJS has, you might not go back. 😀

## Using EJS magic

So far our `header.ejs` file has just been sitting around. Let''s give it something to do. Go ahead and paste in the following code:

``` {#header.ejs}
<header>
  <h1>Express + EJS = ❤️</h1>
</header>
```

If you refresh your browser, nothing will happen yet. In order to use this code, we have to tell our `index.ejs` file where we want to put it. To do that, we''ll use our first bit of EJS code.

```{#index.ejs}
<%- include(''../partials/header'') %>
```

This might look a little different than what we''re used to, but you''ll use it much like you would an HTML tag. In general, `<%` opens an EJS statement and `%>` closes it.

In this particular example, we are using `<%-` to open an EJS statement and render the results in the browser instead of showing the `<`, `>`, and other special HTML characters.

Place this in your HTML where you want your header to go. When Express creates the view, it will place the content from `header.ejs` right into your page. If you refresh your page, you''ll see something like this:

![Express EJS header in action](http://i.imgur.com/qS50etX.png)

You can use a partial in as many files as you want. If you create another 10 pages, you could have the same header in every one of them. Any time you make a change, every file would update automatically (once you refresh your browser window of course).

### Pass data into the view

Where EJS really shines is in the ease of adding data to your pages. What do we mean by that? Let''s add some data in our `server.js` file:

``` {#server.js}
const article = {
  title: ''Squirrel escapes squirrel prison, now at large!'',
  content: ''Yesterday evening at 7:47PM, the criminal squirrel Rabid Rabindra got out of his cage.''
}
```

We can pass that data to `index.ejs` by changing our route slightly:

``` {#server.js}
app.get(''/'', function (request, response) {
  response.render(''pages/index'', {
    article: article
  })
})
```

The `response.render` function can take an object as a second argument. We can use this object to pass any data we want to the view. In this case, we''re passing in the `article` object we just created. We''ll be able to use the data in `index.ejs` like this:

``` {#index.ejs}
<article>
  <h2><%= article.title %></h2>
  <p><%= article.content %></p>
</article>
```

Here we''re using a new type of EJS tag `<%=`. When we want some variable, object, etc. to be rendered to the page, we''ll put an equal `=` sign after our opening EJS tag.

Restart your server in the terminal and you should see the breaking news story at `localhost:8080`! 🐿️

## Spread the news

Cool, but if we''re going to be a real news source, we want to have a _bunch_ of articles on our site, not just one. So let''s change our object up a bit:

``` {#server.js}
const articles = {}
```

Don''t forget to update the reference to the `article` object in your `/` route too:

``` {#server.js}
app.get(''/'', function (request, response) {
  response.render(''pages/index'', {
    articles: articles
  })
})
```

Now let''s make a function to create new articles:

```{#server.js}
function createArticle (article) {
  const id = Object.keys(articles).length
  article.createdAt = new Date()
  articles[id] = article
}
```
Let''s go over some of this code: 

```{.js}
function createArticle (article) {
```

First, we declare the `createArticle` function that accepts an `article` parameter.

```{.js}
const id = Object.keys(articles).length
```

`Object.keys()` is a function that takes an object, and returns a list of its keys.

We use the `length` property to know how many articles there are. Our first article will be given an `id` of `0`. We haven''t created any articles yet, so when we check the `length` of `Object.keys(articles)`, it will return `0`. Likewise, our second article will have an id of `1`, and so on.

```{.js}
article.createdAt = new Date()
```

`new Date()` returns the current date and time. We use this to add a `createdAt` property showing the time the article was posted.

```{.js}
articles[id] = article
```

We then add our new article to our `articles` object.

### Adding some data

Now let''s use our new function to create some fresh news:

```{#server.js}
createArticle({
  title: ''Squirrel escapes squirrel prison, now at large!'',
  content: ''Yesterday evening at 7:47PM, the criminal squirrel Rabid Rabindra got out of his cage.''
})
createArticle({
  title: ''Squirrel lured back into prison with peanut butter'',
  content: ''This morning at 10:13PM, the smell of peanut butter drew Rabid Rabindra the squirrel back into his cage.''
})
```

If you try running your server again, you''ll get an error, because your data is no longer hooked up to the view. Let''s fix that by updating `index.ejs`:

```{#index.ejs}
<% Object.keys(articles).forEach(function (id) { %>
  <article>
    <h2><%= articles[id].title %></h2>
    <p><%= articles[id].content %></p>
  </article>
<% }) %>
```

Just like before, `Object.keys(articles)` looks at our `articles` object and fetches the keys for all of our entries, but this time we use a brand new method.

`forEach` runs the supplied function for each item in a list. In our case, we have a list of keys so the function we provide will be passed the `id` of an article. We can then use that `id` to output the corresponding article as HTML.

Since we have two articles, `forEach` will call the function twice. When we restart the server, we should see two articles printed to the page. 🐿️🐿️

## Static files and `app.use`

We''re in the media biz and you know what they say: content is king. Our stories are some of the best, but no one is reading them. I mean, would you?

![Screenshot of ugly site](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/real-news-before.png)
Looks pretty booooring.

But where do we put our styles? Where do we put pictures? Do we put them in our project root still? Do we put them in our views folder? If so, how do we link to them?

![Why does everything have to be so complicated](https://media2.giphy.com/media/NJNuxbhsQ3u4E/giphy-facebook_s.jpg?t=1)

Take a deep breath. There''s no need to worry, Express has us covered!

### `app.use` and `express.static`

Express gives us a lot of flexibility out of the box. We can use the `app.use` function in Express to turn on new functionality as needed.

Let''s call `app.use` to create a static server for our images, CSS, and client-side JavaScript. Copy this line and place it _above_ your routes and _below_ `app.set(''view engine'', ''ejs'')` in `server.js`:

```{#server.js}
app.use(express.static(''public''))
```

We''re making use of Express''s built in `express.static` function. This allows us to declare the name of a directory where we''ll serve files, just like we would with a static server such as `live-server`. In this case, we tell Express to look in the `public` directory.

Let''s create our `public` directory in the root of our project and inside that, a directory named `css` for our CSS files. If we add a `style.css` file to the `public/css` directory, we can link to it like this:

```{#index.ejs}
<link rel="stylesheet" type="text/css" href="/css/style.css">
```

Now we can add as many styles (or in this case, as few) as we want to make our page look nicer.

![Screenshot of pretty site](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/real-news-after.png)
', NULL, '-KfxL35ERbtEU5OctGcX', 'Make a fansite based on something you like (sandwiches, movies, emo bands, etc.)', 'Heroku', 5);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (209, 'html-more-kinds-of-content', 'Present a wider variety of content in your HTML', 1, '## Controlling spacing with HTML (`br`, `&amp;nbsp;`, `pre`)

In programming, *whitespace* refers to any characters that aren''t normally visible. These include spaces, tab characters, and new lines. There''s a single name for all of these because *HTML converts any series of whitespace into a single space*.

So for example, this:

``` {.html}
So     many           spaces
```

Will simply be rendered as:

~~~ {.result}
So     many           spaces
~~~

That also means you can sometimes get spaces where you don''t want them. This most commonly happens with nested elements:

``` {.html}
<p>
  There will be a space after
  <strong>
    this text
  </strong>
  .
</p>
```
~~~ {.result}
<p>
  There will be a space after
  <strong>
    this text
  </strong>
  .
</p>
~~~

Notice the space before the period? Yuck. Let''s try removing the whitespace between the closing `</strong>` tag and the period:

``` {.html}
<p>
  There will be a space after
  <strong>
    this text
  </strong>.
</p>
```
~~~ {.result}
<p>
  There will be a space after
  <strong>
    this text
  </strong>.
</p>
~~~

Same result! You have to _also_ remove the whitespace between `this text` and the closing `</strong>` tag.

``` {.html}
<p>
  There will be a space after
  <strong>
    this text</strong>.
</p>
```
~~~ {.result}
<p>
  There will be a space after
  <strong>
    this text</strong>.
</p>
~~~

The rendered result looks better, but our code looks worse. To make the code spacing consistent again, we have to move the entire `strong` element onto one line:

``` {.html}
<p>
  There will be a space after
  <strong>this text</strong>.
</p>
```
~~~ {.result}
<p>
  There will be a space after
  <strong>this text</strong>.
</p>
~~~

Much better. This is an important lesson to learn, because it won''t be long before it bites you - if it hasn''t already.

### HTML to add new lines and spaces

~~~ {.warning}
We''re about to teach you some new HTML tricks, but note that *these features can very easily be abused, so use them only in circumstances like those described below*. If misused in a project, it will probably be rejected. This is for your own good, because they can quickly lead to code that''s very difficult to maintain. You''ll see an example at the end.
~~~

#### Using the `br` element to manually create new lines

This is a self-closing element that creates a new line (or "line *br*eak"). They''re most appropriate where new lines are an essential part of the content.

For example, in a haiku, where you need a specific number of syllables on each line:

``` {.html}
<p>
  Writing code all day<br>
  It works! So beautiful 😂<br>
  Time to pass out now<br>
</p>
```
~~~ {.result.poetry}
<p>
  Writing code all day<br>
  It works! So beautiful 😂<br>
  Time to pass out now<br>
</p>
~~~

We came up with that ourselves, though there was some  debate over how many syllables "beautiful" was. We also weren''t exactly sure what the rules about emoji in haikus are, but we figure everything is better with emoji, right? 🍪

#### The space character code (`&amp;nbsp;`)

Woah, this doesn''t even look like an element! That''s because it''s not. It''s an HTML *character code* that manually creates a space. More specifically, the `nbsp` stands for Non-Breaking Space, meaning it also won''t overflow onto the next line like normal text.

You''ll probably see it used most commonly to create a little more space between text and symbols:

``` {.html}
<p>These are junk foods:</p>
<ul>
  <li>🍕&amp;nbsp;&amp;nbsp; Pizza</li>
  <li>🌯&amp;nbsp;&amp;nbsp; Burrito</li>
  <li>🍔&amp;nbsp;&amp;nbsp; Hamburger</li>
</ul>
```
~~~ {.result}
<p>These are junk foods:</p>
<ul>
  <li>🍕&nbsp;&nbsp; Pizza</li>
  <li>🌯&nbsp;&nbsp; Burrito</li>
  <li>🍔&nbsp;&nbsp; Hamburger</li>
</ul>
~~~

Unfortunately, even this use case is a bad idea. As you learn more about CSS, you''ll learn about better alternatives (_down to the pixel_!) for controlling spacing in situations like this. As a general rule you should simply *never use `&amp;nbsp;`, or if you do, have a really, really good reason*.

### How to _really_ abuse `br` and `&amp;nbsp;`

<blockquote>
  "Wow, I''m a pretty responsible person and my life is pretty easy. If only there were some way I could make everything much more difficult in the near future."
</blockquote>

If you ever wake up with that thought, then this section is for you! Once people learn about `br` and `&amp;nbsp;`, it''s not uncommon to see code like this:

``` {.html}
<strong>My todo list</strong>
<br><br>
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;- Learn code 📖<br>
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;- Write code 💻<br>
&amp;nbsp;&amp;nbsp;&amp;nbsp;&amp;nbsp;- Profit 💰<br>
```
~~~ {.result}
<strong>My todo list</strong>
<br><br>
&nbsp;&nbsp;&nbsp;&nbsp;- Learn code 📖<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Write code 💻<br>
&nbsp;&nbsp;&nbsp;&nbsp;- Profit 💰<br>
~~~

Please... don''t ever do this. You''re not only:

* restricting your vertical spacing to 1-line increments and
* restricting your horizontal spacing to 1-space increments

But whenever you want to adjust the spacing on your site, you''ll have to dig around for all of these examples and adjust each one individually. It''s not fun work. If you don''t believe us, perhaps you''ll heed this cautionary tale of another fearless programmer who thought best practice didn''t apply to them:

[![One little goto (xkcd.com)](https://imgs.xkcd.com/comics/goto.png)](https://xkcd.com/292/?.png)

True story.

### Using the `pre` element for preformatted text

Sometimes _all whitespace_ is important to display. In those cases, we can use the `pre` element. Here''s a simple example:

``` {.html}
<pre>This is
      some    pre-formatted 

  text.</pre>
```
~~~ {.result}
<pre>This is
      some    pre-formatted
      
  text.</pre>
~~~

As you can see, _every_ whitespace character inside the `pre` element is preserved. Each space is displayed as a space; new lines are displayed as new lines. By default, the text inside `pre` elements also use a *monospace font*, meaning every character is the same width.

You may also notice that we''re breaking a code style rule! Even though the content of the `pre` element spans multiple lines, we put the opening and closing tags right up against the text, where it begins and ends. That''s because starting with `This is` on a new line in our code would mean an empty line would be displayed to the user! The `pre` element takes its all-whitespace-is-displayed job seriously.

#### Use cases for the `pre` element

Now, are you ready to get meta? All the code examples on this page are actually inside `pre` elements! That''s how we''re able to display raw HTML code, whitespace and all.

Besides code examples, `pre` elements can also be useful for some poems that make use of whitespace for stylistic purposes, like this one called _The Sky Was_ by E.E. Cummings:

``` {.html}
<pre>the
     sky
           was
can    dy    lu
minous
            edible
spry
        pinks shy
lemons
greens    coo    1 choc
olate
s.

  un    der,
  a    lo
co
mo
      tive        s  pout
                               ing
                                     vi
                                     o
                                     lets</pre>
```
~~~ {.result}
<pre>the
     sky
           was
can    dy    lu
minous
            edible
spry
        pinks shy
lemons
greens    coo    1 choc
olate
s.

  un    der,
  a    lo
co
mo
      tive        s  pout
                               ing
                                     vi
                                     o
                                     lets</pre>
~~~

## Tables (`table`, `tr`, `th`, `td`, `thead`, `tbody`, `tfoot`)

### The `table` element

Sometimes data is best represented in tables, like this:

<table>
  <tr>
    <th>First Name</th>
    <th>Age</th>
    <th>Position</th>
  </tr>
  <tr>
    <td>Carla</td>
    <td>32</td>
    <td>Lead Backend Engineer</td>
  </tr>
  <tr>
    <td>Xiao</td>
    <td>24</td>
    <td>Lead Frontend Engineer</td>
  </tr>
  <tr>
    <td>Janelle</td>
    <td>27</td>
    <td>Lead Designer</td>
  </tr>
</table>

Here''s the code for that table:

``` {.html}
<table>
  <tr>
    <th>First Name</th>
    <th>Age</th>
    <th>Position</th>
  </tr>
  <tr>
    <td>Carla</td>
    <td>32</td>
    <td>Lead Backend Engineer</td>
  </tr>
  <tr>
    <td>Xiao</td>
    <td>24</td>
    <td>Lead Frontend Engineer</td>
  </tr>
  <tr>
    <td>Janelle</td>
    <td>27</td>
    <td>Lead Designer</td>
  </tr>
</table>
```

It might look a little overwhelming at first. There are quite a few new elements in there, all starting with `t` (for "table"). Let''s review them:

* 

  `table`: represents data in a two-dimensional *table*.
  
* 
  
  `tr`: defines a *row* of *cells* in a table, which can be a mix of `th` and `td` elements (see below)
  
* 
  
  `th`: defines a cell that contains a table *header*
  
* 

  `td`: defines a cell that contains table *data*

You can also split your tables into several different sections for more complex tables, like this group did to organize the costs of their last junk food party:

<table>
  <thead>
    <tr>
      <th></th>
      <th>Pizza Slices<br>($2/🍕)</th>
      <th>Burritos<br>($6/🌯)</th>
      <th>Burgers<br>($4/🍔)</th>
      <th>Totals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Carla</th>
      <td>2</td>
      <td>6</td>
      <td>2</td>
      <td>$48</td>
    </tr>
    <tr>
      <th>Xiao</th>
      <td>8</td>
      <td>3</td>
      <td>5</td>
      <td>$54</td>
    </tr>
    <tr>
      <th>Janelle</th>
      <td>2</td>
      <td>6</td>
      <td>3</td>
      <td>$52</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th colspan="4">Group Total</th>
      <td>$154</td>
    </tr>
  </tfoot>
</table>

This was built by organizing the content into 3 new elements:

* 
   
   `thead`: the table header, typically only containing `th` cells

* 

  `tbody`: the table''s body (i.e. main content)
  
* 

  `tfoot` the table''s footer, often used for summaries

Here''s what they look like in action:

``` {.html}
<table>
  <thead>
    <tr>
      <th></th>
      <th>Pizza Slices<br>($2/🍕)</th>
      <th>Burritos<br>($6/🌯)</th>
      <th>Burgers<br>($4/🍔)</th>
      <th>Totals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Carla</th>
      <td>2</td>
      <td>6</td>
      <td>2</td>
      <td>$48</td>
    </tr>
    <tr>
      <th>Xiao</th>
      <td>8</td>
      <td>3</td>
      <td>5</td>
      <td>$54</td>
    </tr>
    <tr>
      <th>Janelle</th>
      <td>2</td>
      <td>6</td>
      <td>3</td>
      <td>$52</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <th colspan="4">Group Total</th>
      <td>$154</td>
    </tr>
  </tfoot>
</table>
```

~~~ {.note}
Did you see the appropriate use of `<br>` in there? Throwback!
~~~

You may also notice a `colspan` attribute that controls how many columns a cell should span horizontally. Elements related to tables actually have a lot of special attributes. We won''t go over all of them here though. If you''re really interested in learning all there is to know about tables, we recommend this [Complete Guide to the Table Element](https://css-tricks.com/complete-guide-table-element/).

~~~ {.warning}
Do *not* use tables for the layout of your content. It is not semantically correct and there are actually better methods to manage layout using CSS, as you''ll learn later.

There is one exception, however. Tables pretty much _must_ be used for layout when building HTML emails.
~~~

## Video and audio (`video`, `audio`)

Adding video and audio to your pages might sound like advanced features, but it''s actually made very simple with modern HTML -- as easy as adding an image.

There''s a `video` element and an `audio` element, both sharing many of the same attributes. For example, they both:

* use a `src` attribute to point to a file
* accept a `controls` attribute to add controls (e.g. play, pause, change volume, etc.)

``` {.html}
<video controls src="http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_stereo.ogg"></video>
```
~~~ {.result}
<video controls src="http://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_480p_stereo.ogg"></video>
~~~

``` {.html}
<audio controls src="https://cdn.rawgit.com/wesbos/JavaScript30/5c8d8986/01%20-%20JavaScript%20Drum%20Kit/sounds/openhat.wav"></audio>
```
~~~ {.result}
<audio controls src="https://cdn.rawgit.com/wesbos/JavaScript30/5c8d8986/01%20-%20JavaScript%20Drum%20Kit/sounds/openhat.wav"></audio>
~~~

~~~ {.warning}
Unlike the very similar `img` element, these elements are *not* self-closing. Don''t forget the closing tag!
~~~

You''ve probably noticed that the `controls` attribute has no value. Your eyes do not deceive you! Indeed, some HTML attributes don''t need a value, because they only indicate something that''s either true or false. In this case, the player will either have controls or it won''t.

There''s also a lot more to both of these elements than we show here, including attributes to make them `autoplay` and `loop` - please don''t use those two in your projects! They are very annoying most of the time. 😫 &nbsp;One example of where they might be appropriate though, is for a subtle looping background animation.

Check out the following documentation to learn more about the other, less annoying features of these elements:

* [`video`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video)
* [`audio`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio)

## External content (`iframe`)

Sometimes you''ll want to show content from _another_ page inside the page you''re building. For example, when embedding a YouTube video:

``` {.html}
<iframe allowfullscreen height="315" src="https://www.youtube.com/embed/fzzjgBAaWZw?rel=0"></iframe>
```
~~~ {.result}
<iframe allowfullscreen height="300" src="https://www.youtube.com/embed/fzzjgBAaWZw?rel=0"></iframe>
~~~

or a map:

``` {.html}
<iframe height="300" src="https://maps.google.com/maps?q=michigan+state+university&amp;output=embed"></iframe>
```
~~~ {.result}
<iframe height="300" src="https://maps.google.com/maps?q=michigan+state+university&amp;output=embed"></iframe>
~~~

You can actually embed a page from _any_ website, as long as that website doesn''t add security rules to prevent it. For example, here''s the complete HTML5 Reference documentation:

``` {.html}
<iframe height="500" src="https://dev.w3.org/html5/html-author/"></iframe>
```
~~~ {.result}
<iframe height="500" src="https://dev.w3.org/html5/html-author/"></iframe>
~~~

Similar to some of the other elements we introduced in this lesson, the `iframe` element has many other features beyond the basic usage you see in the examples above. To learn more, see [the `iframe` documentation](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe).
', NULL, '-KaPzDNPadTEi7OSB7Pe', 'Build a marketing page for an imaginary, soon-to-be-released game (you invent the details)', 'GitHub Pages', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (214, 'js-conditionals', 'Use comparisons in JavaScript to choose how to respond to users', 3, '## Comparing things for equality (`===`, `if`, `else`)

<iframe width="100%" height="320" style="margin-top: 20px" src="//jsfiddle.net/hcodelab/76v542n8/3/embedded/result,js,html/dark/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

If you want to know the codeword, check out the JavaScript tab in the demo above. As you can see, we''re using some new tricks:

``` {.js}
if (codeword === ''bananas'') {
  window.alert(
    ''One of us, I see. The secrets are revealed '' +
    ''in the rest of this lesson.''
  )
} else {
  window.alert(''Nice try... 😏'')
}
```

There''s an `if`, `else`, and `===`, then some parentheses and curly braces in a context we haven''t seen before.

~~~ {.note}
Also notice that instead of just `alert`, we''re now typing `window.alert`. You may be thinking:

<blockquote>
What''s <code>window</code> and what is it doing here? It looks like <code>window.alert</code> does the same thing as <code>alert</code>, so it''s just more to type...
</blockquote>

That''s true! To answer the first question, `window` refers to the _browser_ window. If you just have:

``` {.js}
alert(''hello'')
```

The JS Standard linter shows a warning:

![alert is not defined](https://i.imgur.com/T4WcS1Y.png)

That''s because features such as `alert` and `prompt` are _not_ actually defined by JavaScript itself. If you were coding on a server, for example, there''d be no `alert` or `prompt` functions. Since you _will_ be writing JavaScript on a server later, this is important information to know!

So this warning is actually helpful. Typing `window.alert` forces you to explicitly acknowledge when you''re using a feature _from the browser `window`_, rather than a feature that works everywhere.
~~~

Now we''ll go through each new concept and see what''s going on, starting with:

### The triple equals operator (`===`)

Let''s look back at our code:

``` {.js}
codeword === ''bananas''
```

Depending on what you entered in the prompt, that will return either `true` or `false`. That''s because the *triple equals operator* (`===`) answers the question, "Are these two things _exactly_ the same?" So it''ll return `false` if the `codeword` is:

* `''apple''`
* `''🍌🍌''` (those are emoji, silly)
* `''bannanas''` (spelled wrong)
* `''Bananas''` (with a capital `B`)
* `''bananas ''` (with a space at the end)

Since it has to be an exact match, it''ll _only_ return `true` when `codeword` is, character-for-character, the string `''bananas''`.

This `true`/`false` information is used by:

### The `if` statement

The `if` statement is what we use to _only_ run a block of code if something is `true`. Again, let''s look back at our code:

``` {.js}
if (codeword === ''bananas'') {
  window.alert(''One of us, I see. The secrets are revealed in the rest of this lesson.'')
}
```

And breaking it down into individual parts, we have:

``` {.js}
if (EXPRESSION) {
  // Code to run ONLY if the EXPRESSION is truthy
}
```

`if`, followed by an *expression* wrapped in parentheses, following by a code block wrapped in curly braces. Just like in a function, you can have as many lines of code between the curly braces as you want.

There are still unanswered questions though:

#### What''s an expression?

An expression is code that returns something. The expression:

``` {.js}
codeword === ''bananas''
```

Returns `true` or `false`. An expression can even be a single value/variable. For example, if you want to ask the user a yes/no question, you could use the `confirm` function. It''s similiar to `alert`, except instead of just an "OK" button, it has both an "OK" and "Cancel" button. Then if the user clicks "OK", it returns `true`. If they click "Cancel", it returns `false`. 

It''s especially useful for confirming that a user didn''t accidentally click on something, like in this example:

``` {.js}
const decidedToCancel = window.confirm(''Are you sure you want to cancel your subscription?'')

if (decidedToCancel) {
  cancelSubscription()
}
```

An expression doesn''t have to return `true` or `false` though. It could return _any_ value. For example, we could replace `codeword === ''bananas''` with just `''hi''`. The string `''hi''` returns, well, the string `''hi''`. There''s nothing special about it. It''s just a random example. 

But what would actually happen with the code below?

``` {.js}
if (''hi'') {
  // When does the code in between these
  // curly braces actually run?
}
```

That brings us to truthiness:
  
#### What does truthy mean?

Everything in JavaScript is either *truthy* or *falsy*.
  
![Colbert truthiness](https://i.imgur.com/o66iNqb.jpg)
  
Yes, we swear we''re not making this up. When something isn''t clearly `true` or `false`, JavaScript really does "go with its gut," just like Stephen Colbert. 

Usually, it does this by trying to answer the question, "Is this _something_ or _nothing_?" In the case of strings, an empty string (`''''`) is falsy, but if it has at least one character, like `''hi''`, it sort of _rounds up to `true`_ -- i.e. it''s truthy.

That means in contexts where truthiness matters, like in an `if` statement, `''hi''` will always be treated the same as `true`. So to answer our earlier question, the code between the curly braces below would _always_ run:

``` {.js}
if (''hi'') {
  // I will always run, because ''hi'' 
  // will always be treated as true
}
```

But remember, an empty string (`''''`) would be falsy, because when answering the question, "Is this _something_ or _nothing_?", JavaScript has decided that it''s closer to nothing, so it _rounds down to `false`_.
  
Stay tuned! You''ll learn more about truthiness later in this lesson.

### The `else` statement

Let''s go back to our first example:

``` {.js}
if (codeword === ''bananas'') {
  window.alert(''One of us, I see. The secrets are revealed in the rest of this lesson.'')
} else {
  window.alert(''Nice try... 😏'')
}
```

If you tried out the demo, you''ll have noticed that you get the "Nice try" message any time you enter something other than `''bananas''`. That''s because *the `else` statement* runs a block of code _only_ if the expression in the `if` statement is falsy.

Note that not every `if` needs an `else`. It''s completely optional. However, an `else` can''t exist without an `if`, which makes sense when you think about it.

## More complex branching (`else if`)

Sometimes even `if` with `else` isn''t enough, because you need to handle a greater number of scenarios, all of which you have contingency plans for. If plan A falls through, you have plan B, then plan C, then plan D, etc. 

In these cases, you can check for more conditions with `else if`:

``` {.js}
if (codeword === ''bananas'') {
  window.alert(''Success! That\\''s the codeword!'')
} else if (codeword === ''apples'') {
  window.alert(''Sorry, wrong fruit.'')
} else if (codeword === ''🍌🍌'') {
  window.alert(''Cute, we were looking for it spelled out.'')
} else if (codeword === ''bannanas'') {
  window.alert(''It\\''s spelled "bananas" - try again.'')
} else if (codeword === ''Bananas'') {
  window.alert(''No capital letters allowed!'')
} else if (codeword === ''bananas '') {
  window.alert(''Sigh... extra space at the end, but close enough.'')
} else {
  window.alert(''Nice try... 😏'')
}
```

JavaScript will go through each expression, from top to bottom, until it finds one of these:

* a truthy expression
* an `else`
* the end of the `if` chain

Once a truthy expression or `else` is found, the corresponding code block will run and JavaScript won''t even look at the rest of the `if` chain. That means if you have an `else` (and again, an `else` is always optional), it always needs to be at the end.

It also means you _only_ want to use chains with `else if` when you want _exclusive_ branching -- i.e. it''s guaranteed that _only one_ of the code blocks will run (if any).

### Simplifying branching

Once people learn about `if` statements, it''s often tempting to use them everywhere, like this:

``` {.js}
if (timeOfDay === ''morning'') {
  window.alert(''Good morning!'')
} else if (timeOfDay === ''afternoon'')
  window.alert(''Good afternoon!'')
} else if (timeOfDay === ''evening'') {
  window.alert(''Good evening!'')
} else if (timeOfDay === ''night'') {
  window.alert(''Good night!'')
} else {
  window.alert(''Good day!'')
}
```

In each of these, there''s a pattern where we simply say "Good", followed by the time of day, followed by an exclamation point (`''!''`). When you see a pattern like this, there''s almost always a way to make it simpler. 

For example, the above code could be shortened to:

``` {.js}
if (timeOfDay) {
  window.alert(''Good '' + timeOfDay + ''!'')
} else {
  window.alert(''Good day!'')
}
```

Now we simply check if a `timeOfDay` has been set. If it has, we follow our pattern. Otherwise, we just say, "Good day!"

### Nested `if` statements

Take a look here:

``` {.js}
if (timeOfDay) {
  window.alert(''Good '' + timeOfDay + ''!'')
  if (timeOfDay === ''morning'') {
    if (weather === ''rain'') {
      window.alert(''Don\\''t forget to bring an umbrella!'')
    } else if (weather === ''snow'') {
      window.alert(''Bundle up warm! It\\''s snowing.'')
    }
  }
} else {
  window.alert(''Good day!'')
}
```

There''s an `if` inside an `if` inside an `if`! Yep -- we do that. In this case, we check if the `timeOfDay` has been set, then:

* If `timeOfDay` is truthy...
  
  * We greet the user with the `timeOfDay`
  
  * Then we check if `timeOfDay` is `''morning''`
    
    * If `timeOfDay` is `''morning''`...
      
      * We check to see if `weather` is `rain`
        
        * If `weather` is `rain`...
          
          * We warn the user to bring an umbrella
        
        * Otherwise...
          
          * If `weather` is `snow`...
          
            * We warn the user to bundle up

* Otherwise...
  
  * We just greet the user with a generic, "Good day!"

As you can see, there''s quite a bit happening there! In later lessons, we''ll learn how to handle complex logic like this in an easier way.

## Other comparison operators (`!==`, `!`, `>`, `<`, `>=`, `<=`)

`===` is not the only *comparison operator* (operator that returns either `true` or `false`). The simplest other operator is `!==`, meaning _not_ exactly equal to:

``` {.js}
// capital "A" vs lowercase "a"
''Apple'' !== ''apple''
```

The string `''Apple''` is not exactly equal to the string `''apple''`, so this will return `true`. The exclamation point (`!`) is actually also an operator on its own. It just means _not_.

### The "not" operator (`!`)

This one is more useful than it might seem at first. For example, if you have a smart phone, it''s very likely that tapping the power button will either:

* turn the screen on, if it was off, _or_
* turn the screen off, if it was on

Internally, your phone might be using a variable like this:

``` {.js}
let screenIsOn = true
```

Then whenever you tap the power button, it''ll do this:

``` {.js}
screenIsOn = !screenIsOn
```

That just sets `screenIsOn` to the _opposite_ of what it is now. If it''s currently `true`, it''ll set to `false`, otherwise it''ll set to `true`. It works, because `!true` is `false` and `!false` is `true`. It''s a toggle!

It''s doing the same work as this much longer `if` statement:

``` {.js}
if (screenIsOn) {
  screenIsOn = false
} else {
  screenIsOn = true
}
```

### Using `!!` as a truthiness detector

The `!` operator has another trick up its sleeve. *Double not* (`!!`) can tell you whether _any_ value is truthy or falsy. It works by *type casting* the value to a *boolean*. We''ll explain.

In programming, a boolean is the name for something that''s either `true` or `false` -- those are the only two values. It''s a *type* of value. String and numbers are other types we''ve worked with. And finally, type casting means changing a value from one type to another (e.g. from a number to a boolean, or from a string to a number).

<figure>
  <figcaption style="text-align:center;font-weight:bold;font-size:1.15em;font-style:italic">
    <code>''hi''</code>, I turn you into a <code>true</code>!
  </figcaption>
  <img src="https://i.imgur.com/PWINL5N.jpg" alt="Spell casting">
</figure>

Now let''s try our truthiness detector on some strings and numbers (things that aren''t already either `true` or `false`):

``` {.js}
!!''hi'' //=> true
!!''''   //=> false
!!1    //=> true
!!3.14 //=> true
!!0    //=> false
```

Only two of the above examples are falsy: an empty string (`''''`) and the number `0`. Whenever you''re unsure about a value, you can test it like this in the JavaScript console. Here''s also a list of [common values and their truthiness](https://dorey.github.io/JavaScript-Equality-Table/#if-statement) for those that are curious.

### The other operators (and type coercion)

Here are the other useful comparison operators in JavaScript:

* `>`: greater than
* `<`: less than
* `>=`: greater than or equal to
* `<=`: less than or equal to

An important note about these is that they do _not_ care if the things they''re comparing are of the same type, unlike `===` and `!==` (e.g. `1 === ''1''` returns `false`). Instead, these operators use *type coercion* (coercion means _conversion_ in this context) to compare values of different types. For example:

``` {.js}
1 > ''0'' //=> true
```

The above returns `true`, because JavaScript sees a number (`1`) and a string (`''0''`), then tries to coerce (i.e. convert) the string into a number. It succeeds and then compares `1 > 0`.

If the string can''t be coerced into a number, for example with:

``` {.js}
1 > ''hi'' //=> false
```

Then the comparison will always return `false`. At first glance, type coercion might seem very useful! Unfortunately, it is also one of the hidden dangers of JavaScript, because the behavior is not always easy to predict.

For example:

``` {.js}
1 > '''' //=> true
```

You may not have expected this to be `true`! JavaScript coerces an empty string into `0`, then returns `true` because `1` is greater than `0`. You''ll learn how to deal with type coercion later in this lesson.

## Combining expressions with logical operators (`&&`, `||`)

Sometimes, you want to check if two or more things are _all_ truthy. Or, if _any_ of them are truthy. For this task, JavaScript offers two *logical operators*:

* `&&`: *the "and" operator* (two ampersands)
* `||`: *the "or" operator* (two pipes)

Now, I know what you''re probably thinking.

<blockquote>
  Uhh... what? Pipe? I don''t think that''s on my keyboard.
</blockquote>

It _is_ on your keyboard, but you may have never used it before. It''s usually somewhere next to the `Enter` key and you have to hold `Shift` to get to it:

![Pipe key on keyboard](https://i.imgur.com/GnxlpXX.jpg)

Let''s take a deeper dive into how each operator works.

### The "and" operator (`&&`)

The "and" operator combines expressions to answer the question, "Are all of these things truthy?" When all expressions are truthy, the combined expression will be truthy:

``` {.js}
true && true  //=> true
```

But if any of them are falsy, the combined expression will be falsy:

``` {.js}
true && false //=> false
false && true //=> false
```

Let''s say you''re at a friend''s house and you''re really in the mood for hot chocolate with marshmallows. You might ask:

``` {.js}
// Do you have ALL of these: cocoa and milk and marshmallows?
cocoa && milk && marshmallows
```

If they don''t have cocoa, they''ll probably stop you right there, saying, "No, we don''t have cocoa." After all, there''s no reason to hear the entire list if you''re missing even one vital ingredient.

If they _do_ have everything though, they''ll listen until the end, then tell you, "Yes, we have everything - even marshmallows!"

This is exactly how `&&` works. JavaScript will read each expression from left to right, then stop to complain about the first falsy value it sees. If the `cocoa` variable were falsy (e.g. contained an empty string), the expression would stop and return that empty string:

``` {.js}
'''' && ''milk'' && ''marshmallows'' //=> ''''
```

But when everything is truthy, it gets all the way to the end, then returns that final truthy value:

``` {.js}
''cocoa'' && ''milk'' && ''marshmallows'' //=> ''marshmallows''
```

The `&&` operator doesn''t just work with booleans and strings though -- it can connect any combination of expressions:

``` {.js}
1 && 2 //=> 2
1 && 0 //=> 0
0 && 1 //=> 0
0 && 0 //=> 0

1 && 2 && 3 //=> 3
1 && 0 && 3 //=> 0

''cocoa'' && false && 0 //=> false
''cocoa'' && 0 && false //=> 0
'''' && false && 42     //=> ''''
''cocoa'' && true && 42 //=> 42
```

### The "or" operator (`||`)

The "or" operator works similarly, except it will return either:

* The first truthy value it finds, _or_
* If there are no truthy values, the last value

This will make sense once we bring it back to hot chocolate. Imagine your friend answers your first question with, "Sorry, no milk! I''m lactose intolerant." That''s fine. You''ll just ask a new question:

``` {.js}
// Do you have ANY of these: almond milk or soy milk or coconut milk?
almondMilk || soyMilk || coconutMilk
```

Your friend will assume you''re asking in the order you prefer, so if they don''t have almond milk but they do have soy milk, they''ll interrupt with, "Yes, we have soy milk!" 

``` {.js}
'''' || ''soy milk'' || '''' //=> ''soy milk''
```

If they didn''t have any though, they''d listen to the entire list before their sad reply, "No, we don''t have any of those -- not even coconut milk."

``` {.js}
'''' || '''' || '''' //=> ''''
```

Just like the "and" operator, the "or" operator works with any combination of expressions:

``` {.js}
true || true   //=> true
true || false  //=> true
false || true  //=> true
false || false //=> false

1 || 2 || 3 || 4     //=> 1
1 || 0 || false      //=> 1
0 || false || 2 || 1 //=> 2
0 || false || ''''     //=> ''''
```

### Using logical operators in `if` statements

To use logical operators in `if` statements, you just put the combined expression inside the parentheses after the `if` (or `else if`). For example:

``` {.js}
if (itsLightOut && !itsRaining) {
  window.alert(''Go outside and get some exercise!'')
}
```

When you want to combine `&&` and `||`, you can control which questions get asked first with parentheses:

``` {.js}
(itsLightOut && !itsRaining) || youHaventLeftTheHouseInAWeek
```

That has a very different meaning from:

``` {.js}
itsLightOut && (!itsRaining || youHaventLeftTheHouseInAWeek)
```

In the former, the expression will be truthy if:

* it''s light out and it''s not raining, _or_
* if you haven''t left the house in a week

In the latter, the expression will be truthy if:

* it''s light out, _and_
* it''s not raining or you haven''t left the house in a week

So in the first case, _day or night_, if you haven''t left the house in a week, we''ll recommend you go outside. In the second case, it _has_ to be light out for us to recommend you go out. A subtle, but important difference.

Combined expressions like these can grow quite complex. When they start getting pretty long, it''s usually best to assign the result of the combined expression to a variable, then use the new variable in the `if` statement, like this:

``` {.js}
const userShouldGoOutside = (
  (itsLightOut && !itsRaining) || 
  youHaventLeftTheHouseInAWeek
)

if (userShouldGoOutside) {
  window.alert(''Go outside and get some exercise!'')
}
```

### Using `&&` with `||`

Unfortunately, code doesn''t allow you to ask follow-up questions. You have to write every question that might come up before you run it. Since that''s the case, let''s put our `&&`s and `||`s together: 

``` {.js}
const hotChocolateIsAvailable = (
  cocoa && 
  (milk || almondMilk || soyMilk || coconutMilk) && 
  marshmallows
)
```

Above, we have a set of parentheses around all the different kinds of milk, so that JavaScript knows to look at them together. If we didn''t do this, it would immediately stop if it didn''t find milk.

## Handling special cases for strings

### Empty strings (`''''`)

When an `input` or `textarea` is empty, their values will be an empty string (`''''`). The same is true for a `prompt`, if the user presses OK without entering anything.

Since an empty string is falsy in JavaScript, you can check if the user has typed anything by simply using the variable as the expression in an `if` statement. For example:

``` {.js}
const color = window.prompt(''What\\''s your favorite color?'')
// If the user typed something...
if (color) {
  if (color === ''blue'') {
    window.alert(''Yay! Blue is my favorite color too! 😂'')
  } else {
    window.alert(''Hmm... I was hoping you liked blue. 😞'')
  }
// If they did NOT type anything...
} else {
  window.alert(''You... you didn\\''t even type anything. 😭'')
}
```

### Trimming extra whitespace

The tip above is not fool-proof. For example, if a string has only a space in it, it will still be truthy, because it''s not _technically_ empty. It has a character in it. Fortunately there''s a method on strings that can help us control for whitespace we don''t care about.

``` {.js}
'' ''.trim()        //=> ''''
''        ''.trim() //=> ''''

''hi ''.trim()       //=> ''hi''
'' hi''.trim()       //=> ''hi''
''    hi   ''.trim() //=> ''hi''

''  hello    there  ''.trim() //=> ''hello    there''
```

*The `trim` method* returns a new string, removing any whitespace at the beginning or end. However, extra spaces in between words will remain, as you can see in the last example.

The `trim` method is very useful for *normalizing* user input. Normalizing means removing variations that we don''t care about. In this case, we don''t care whether there''s extra whitespace, so trimming it out allows us to treat `''bananas  ''` the same as `''bananas''`.

~~~ {.note}
Note that the `trim` method does _not_ modify the original string. For example, in this code:

``` {.js}
const greeting = ''hello   ''
console.log(greeting.trim()) //=> ''hello''
console.log(greeting)        //=> ''hello   ''
```

The variable `greeting` still contains `''hello   ''` after `.trim()` is called on it. To save the trimmed string, you have to either reassign the `greeting` variable:

``` {.js}
let greeting = ''hello   ''
greeting = greeting.trim()
console.log(greeting) //=> ''hello''
```

Or declare a new variable to store the trimmed string:

``` {.js}
const greeting = ''hello   ''
const normalizedGreeting = greeting.trim()
console.log(greeting)           //=> ''hello   ''
console.log(normalizedGreeting) //=> ''hello''
```
~~~

### Normalizing capitalization

In our example earlier, `''Bananas''` was not _exactly_ `''bananas''`, which means:

``` {.js}
''Bananas'' === ''bananas'' //=> false
```

Returned `false`.

We often don''t care about capitalization though, and in these cases, we can use one of two string methods:

* `toUpperCase`: returns a new string with all _upper_case characters
* `toLowerCase`: returns a new string with all _lower_case characters

For example:

``` {.js}
''Bananas''.toUpperCase() //=> ''BANANAS''
''Bananas''.toLowerCase() //=> ''bananas
```

So for example, we could normalize our codeword earlier with:

``` {.js}
let codeword = window.prompt(''What\\''s the codeword?'')

// Normalize the codeword
codeword = codeword.toLowerCase()

if (codeword === ''bananas'') {
  // This will now run, even if the codeword was originally:
  //   - ''Bananas''
  //   - ''BaNanAS''
  //   - ''BANANAS''
}
```

You can even _combine_ normalizations, by *chaining* methods. That just means calling them one after the other:

``` {.js}
// Normalize the codeword
codeword = codeword.toLowerCase().trim()
```

## Handling special cases for numbers

### Converting strings into numbers (`parseInt`, `parseFloat`)

When you collect information from a `prompt` or `input`/`textarea` element, you will usually get a string. This even happens when you specifically tell HTML that you''re dealing with a number:

``` {.html}
<input type="number">
```
~~~ {.result}
<input type="number">
~~~

The `input` above won''t allow you to type in letters and includes controls on the right to make the number go up or down. But when you check its `value`, you will still see number inside a string:

``` {.js}
''14''
```

Sometimes, this doesn''t cause any problems. For example, these operators all correctly convert the strings into numbers:

``` {.js}
''2'' * ''2'' //=> 4
''2'' / ''2'' //=> 1
''2'' - ''2'' //=> 0
```

I left one out though, didn''t I? OK... let''s try addition:

``` {.js}
''2'' + ''2'' //=> ''22''
```

We get the string `''22''` instead! That sort of makes sense, since we''ve previously used `+` to concatenate (i.e. combine) strings, but this even happens when _only one_ of the numbers is inside a string:

``` {.js}
''2'' + 2 //=> ''22''
```

There are two built-in functions to help you deal with this:

* `parseInt`: converts any string into an integer (i.e. whole number)
* `parseFloat` converts any string into a float (i.e. decimal value)

For example:

``` {.js}
parseInt(''2'')      //=> 2
parseInt(''2.25'')   //=> 2
parseInt(''2.9'')    //=> 2
parseFloat(''2'')    //=> 2
parseFloat(''2.25'') //=> 2.25
parseFloat(''2.9'')  //=> 2.9
```

It can even interpret strings with extra, meaningless characters.

``` {.js}
parseInt(''  2  '') //=> 2
parseInt(''2...'')  //=> 2
```

These functions accept variables, too:

``` {.js}
const two = '' 2. ''
parseInt(two) //=> 2
```

However, if you try to parse something that''s not a number:

``` {.js}
parseInt(''hi'') //=> NaN
```

You''ll get back *`NaN`*, which is short for *Not a Number*. Which brings us to...

### Exploring `NaN` (Not a Number)

Let''s look at what happens when you have a `NaN` value and try to do math with it:

``` {.js}
NaN * 2 //=> NaN
NaN / 2 //=> NaN
NaN - 2 //=> NaN
NaN + 2 //=> NaN
```

We''re stuck in `NaN`land (or `NaN`ia). Everything will always be `NaN` now! Well, there _is_ one way out:

``` {.js}
NaN + ''2'' //=> ''NaN2''
```

As if that''s helpful. 😅

Fortunately, there''s a way to check if what we expect to be a number turns out not to be a number -- for example, if we asked the user how old they were, expecting them to enter a number, and they instead responded with an unhelpful, "I''m hungry."

### Providing fallbacks for values

If you want to set a fallback value for cases when you might get `NaN`, you can use the built-in `isNaN` function to check if a variable you _expect_ to be a number is _not_ actually a number:

``` {.js}
let yearsExperience = window.prompt(''How many years have you been programming?'')

if (isNaN(yearsExperience)) {
  yearsExperience = 0
}
```

There are other cases when you might not want to accept _any_ falsy values, such as `''''`, `0`, or `NaN`. For example, what if you''re calculating the totals on a receipt and you have inputs like this:

``` {.html}
<div>
  <label>Cost of item</label>
  <input type="number">
</div>
<div>
  <label>Quantity</label>
  <input type="number">
</div>
```
~~~ {.result}
<div class="flex-row">
  <div class="flex-col">
    <label>Cost of item</label>
    <input type="number" min="0">
  </div>
</div>
<div class="flex-row">
  <div class="flex-col">
    <label>Quantity</label>
    <input type="number" min="1">
  </div>
</div>
~~~

Before the user enters anything, the quantity will be an empty string, which is coerced into `0` for most math. The quantity should always be at least `1` though, because if someone were buying `0` of something, you wouldn''t be filling out a form for it! 

In these cases, you can use the "or" operator (`||`) to set a fallback value when the `quantity` from the form is falsy (e.g. `0` or `''''`).

``` {.js}
quantity = quantity || 1
```

As you might remember, expressions with `||` will return either:

* The first truthy value it finds, _or_
* If there are no truthy values, it returns the last value

That means we''re setting `quantity` to itself if it already contains a truthy value -- in other words, we don''t change its value. However, if `quantity` currently contains a falsy value, then the `||` moves on to the fallback and sets `quantity` to `1`.

## Handling `undefined` or `null` values

In JavaScript, there are two values that mean _nothing_:

* `undefined`
* `null`

### `undefined`

`undefined` is the value a variable starts with if you don''t set a value when you declare it. For example, instead of:

``` {.js}
let highScore = 0
```

You could just declare a variable without setting it to anything:

``` {.js}
let highScore
```

Then `highScore` would be `undefined`. When there''s a good starting value though, it''s always better to set one right from the start.

You may also see `undefined` on properties that haven''t been set. For example, you''ve used `document.getElementById`, but I bet you didn''t know about:

``` {.js}
document.getElementByMagicWord //=> undefined
```

That''s because it doesn''t exist. 😜

### `null`

`null` has a slightly different meaning. While `undefined` means something hasn''t been defined _yet_, `null` means it has specifically been _set_ to nothing. 

For example, in this code:

``` {.js}
const codeword = window.prompt(''What\\''s the codeword?'')
```

The prompt that appears will have a "Cancel" button. Unlike the `confirm` function, where clicking the "Cancel" button will return `false`, the `prompt` function returns `null`. That''s because JavaScript interprets it as the user _refusing_ to provide a value.

Which makes sense. Let''s say you asked someone a question in real life. Then instead of saying anything, they just turned around and walked away. How would you describe it if someone asked you later, "So, what was their answer?". You might respond, "_Nothing_. They _didn''t_ answer."

### The dangers of `null` and `undefined`

The problem with `null` and `undefined` is they''re usually not the type of information we''re expecting. For example, let''s say you just learned about normalizing your strings, then think about what might happen if a user canceled the prompt below:

``` {.js}
let codeword = window.prompt(''What\\''s the codeword?'')

// Normalize the codeword
codeword = codeword.trim().toLowerCase()
```

The code would blow up, with this error in the console:

``` {.output}
Uncaught TypeError: Cannot read property ''trim'' of null
```

The program is complaining that technically, you can''t trim _nothing_.

![JavaScript, you know what I meant](https://i.imgur.com/NeywTru.jpg)

Unfortunately, it really didn''t. Computers are stupid. So you have a few options here:

You can...

#### A) Handle `null`/`undefined` differently

You may want to do something special in these cases. For example, when a `null` value always means the user clicked "Cancel":

``` {.js}
if (codeword === null) {
  window.alert(''Cancel? Cancel?! How dare you!'')
  
  // WARNING! This really does loop
  // forever infinitely until the user
  // closes the tab!
  const alertForever = function () {
    window.alert(''WELCOME TO HELL!!!'')
    alertForever()
  }
  alertForever()
}
```

~~~ {.warning}
We wish it didn''t have to be said, but please don''t include any infinite loops in your projects. It makes us very, very sad. 😢
~~~

#### B) Assign a fallback for `null`/`undefined`

There are some cases where `null`/`undefined` might sneak in, but you don''t want to handle it differently. For example, if you wanted to treat "Cancel" the same as just clicking "OK" without typing anything in.

In this case, you could set `codeword` to an empty string if `codeword` is `null` or `undefined`:

``` {.js}
if (codeword === null || codeword === undefined) {
  codeword = ''''
}
```

If you decide that you want to handle _all_ falsy values (including not only `null` and `undefined`, but also `''''`, `0`, and `false`), you could similarly set a fallback using `||`:

``` {.js}
// Falsy values fall back to an empty string
codeword = codeword || ''''
// Normalize the codeword
codeword = codeword.trim().toLowerCase()
```

## Randomly choosing a branch (`Math.random()`)

OK, so we just got hired to make a video game from _The Matrix_ movies. Well, not hired, exactly. No one''s paying us. We just decided to do it.

So far, this is what we have:

``` {.js}
const pillChoice = window.prompt(''The red pill or the blue pill?'')

// If the user clicks "Cancel" in the prompt
if (pillChoice === null) {
  window.alert(''Wise choice. Why would you accept pills from random strangers?'')
// If the user clicks "OK" in the prompt
} else {
  // Normalize the string
  pillChoice = pillChoice.trim().toLowerCase()

  // If the chosen pill was either red or blue
  if (pillChoice === ''red'' || pillChoice === ''blue'') {
    window.alert(''I don\\''t remember which one actually takes you out of the matrix, but we\\''ll say that was the one.'')
  // If the chosen pill was NEITHER red NOR blue
  } else {
    window.alert(''Sorry, we don\\''t have any "'' + pillChoice + ''" pills - only red or blue.'')
  }
}
```

We''re pretty happy with it, but it has one problem. The same thing _always_ happens. It''s predictable. What if there were some element of randomness?

We accomplish this with `Math.random()`, which gives us a random number between `0` and `1`, such as:

``` {.output}
0.7596357269823499
```

Or:

``` {.output}
0.3172824767735296
```

Combining this with operators for greater than or less than, we can make our program behave differently every time we run it!

Let''s start by making the "Cancel" button a little more exciting:

``` {.js}
// If the user clicks "Cancel" in the prompt
if (pillChoice === null) {
  const randomNumber = Math.random()

  if (randomNumber > 0.5) {
    window.alert(''Wise choice. Why would you accept pills from random strangers?'')
  } else {
    window.alert(''What? That was rude. You can\\''t just start screaming "Cancel" in the middle of a conversation.'')
  }
}
```

Ohh, that felt good. Now there''s a 50% chance that either option will happen. 

We''re feeling a little mad with power now -- let''s create some more:

``` {.js}
// If the user clicks "Cancel" in the prompt
if (pillChoice === null) {
  const randomNumber = Math.random()

  if (randomNumber > 0.7) {
    window.alert(''Wise choice. Why would you accept pills from random strangers?'')
  } else if (randomNumber > 0.5) {
    window.alert(''What? That was rude. You can\\''t just start screaming "Cancel" in the middle of a conversation.'')
  } else if (randomNumber > 0.3) {
    window.alert(''Huh, OK then...'')
  } else if (randomNumber > 0.1 {
    // Remember that the confirm function returns
    // either true ("OK") or false ("Cancel")
    const rainbowPillChoice = window.confirm(''Are you sure? The red one tastes like rainbows!'')

    if (rainbowPillChoice) {
      window.alert(''Uh oh. Turns out you shouldn\\''t eat rainbows. Time to call 911.'')
    } else {
      window.alert(''Good idea. I learned from breakfast cereal that eating the rainbow makes you sick.'')
    }
  } else if (randomNumber > 0.01) {
    window.alert(''You\\''re a canceler, just like your father, McFly!'')
  } else {
    window.alert(''Wow, did you know there\\''s only a 1% chance you\\''d get this message? I never thought it would actually happen. I should have come up with something more interesting to put here...'')
  }
}
```

Now we have a bunch of different possibilities, with different chances of seeing each one. For example, there''s a 30% (`0.3`) chance of seeing the first option and only a 1% (`0.01`) chance of seeing the last option! So on average, people will have to play _100 times_ to see all the possibilities, just within the "Cancel" button. That''s a much more interesting and very replayable game!

## Soaking in the knowledge

![I know if statements](https://i.imgur.com/WL3htg2.jpg)

You may, or may not, be having this moment right now. If you feel like you just saw a _lot_ of new information, that''s OK. You did! We''re getting into the deep end of JavaScript now.

At this point, we recommend taking a look at the project. You may find you need to read this lesson again from the beginning -- especially if you skimmed it the first time. If you feel like taking a break first, that''s OK too. This is serious exercise for your brain and rest might be what you need.

When you''re ready, we have one final resource for you, to help you remember which of the values you''ve seen so far are truthy or falsy. Try out this quiz and see how many truthy and falsy values you can correctly guess!

<iframe width="100%" height="450px" src="https://katiemfritz.github.io/truthy-falsy-quiz/"></iframe>
', NULL, '-KapohabkntevYuMDt4P', 'Make a Rock-Paper-Scissors game with JavaScript', 'GitHub Pages', 3);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (225, 'css-basics', 'Use CSS to change basic website styles', 2, 'Content', NULL, '-KtEoYYyhZrsZGUuDbox', 'Add CSS styles to the code from your last project', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (224, 'js-create-an-api-with-express', 'Create an API with Express', 3, '## What''s an API?

*API* stands for *Application Programming Interface*. In simplest terms, an API is a server that takes a request and sends back a response and is used to communicate with one or more pieces of software. You''ve actually already been making very simple APIs with Node and Express. 🙂

There are all different types of APIs. Some are built specifically to be used for a certain application or set of applications and aren''t available for public use at all.

Many APIs are open to the public and allow anyone to make requests to their servers without first identifying who you are. [Wikipedia](https://en.wikipedia.org/w/api.php?), [GitHub](https://developer.github.com/v3/), and [Spotify](https://developer.spotify.com/) all have public APIs available for you to use. There''s even a [Pokémon API](http://www.pokeapi.co/) that you can use to make your very own Pokémon game!

![There are 3 pokémon here](https://i.imgur.com/7evMDP1.png)

Other APIs are available to anyone so long as you identify yourself or sign-in first. Google has a [suite of APIs](https://developers.google.com/apis-explorer/#p/) like this. You can create an application to send emails, create calendar events, and use data from Google Maps using their APIs. Twitter, Facebook, and Instagram also have APIs like this.

Using an API for your application can be beneficial for a few reasons:

* *Nothing bad can happen unless you let it.* You can let anyone write a front-end for your code, but your API is the ultimate gatekeeper and protector of your data. For example, there are lots of Twitter clients, but none of them can use more than 140 characters per tweet because the API prohibits it.
* *Sharing encourages creativity.* When you let anyone access your API, your data can be used in ways you never dreamed of. Innovation at its finest! The website you''re reading right now is one such example. We used GitHub''s API to make an entirely new type of learning platform.

### Let''s make some requests

Now that you''re excited about APIs, let''s make some API requests. First things first, download and install [Postman](https://www.getpostman.com/).

![Postman logo](https://raw.githubusercontent.com/postmanlabs/postmanlabs.github.io/develop/global-artefacts/postman-logo%2Btext-320x132.png)

This app allows you to easily make API requests, examine the data, and troubleshoot.

After it''s installed, open the application. You should see a bar at the top that looks something like the address bar in your browser. We''ll call this the *request bar*. It has a dropdown alongside it that should say `GET`. If not, set it so that it does.

![Screenshot of request bar](https://i.imgur.com/7d5a2Of.png)

Let''s make a request to an API. Enter the following into your request bar:

``` {.txt}
https://api.github.com/
```

Click the blue _Send_ button. You should see some JSON printed to the window. It''s not pretty, but it''s informative if you read it. You can get data about any GitHub user by requesting a URL in this format:

``` {.txt}
https://api.github.com/users/{user}
```

Try replacing `{user}` with your own GitHub username to find out what people can learn about you when they use GitHub''s API.

You can also view information about a specific repository by following the format below. This time, you can replace `{owner}` with a username and `{repo}` with the name of a repository owned by that user.

``` {.txt}
https://api.github.com/repos/{owner}/{repo}
```

Let''s make a request to the VueJS repository:

``` {.txt}
https://api.github.com/repos/vuejs/vue
```

You should see a TON of data printed to the screen:

![Sample JSON output from GitHub API](http://i.imgur.com/cpX459b.png)

All of this and more is available to the public to create applications that work with and expand upon GitHub.

## Our very own API

Go ahead and create a new folder. Then add this `package.json` file -- it includes all of the dependencies you''ll need to create your first API.

``` {#package.json}
{
  "name": "api-project",
  "version": "1.0.0",
  "scripts": {
    "server": "nodemon server.js"
  },
  "devDependencies": {
    "nodemon": "^2.0.3"
  },
  "dependencies": {
    "body-parser": "^1.19.0",
    "ejs": "^3.1.2",
    "express": "^4.17.1"
  }
}
```

Before we start writing any more code, let''s explore the new things in that `package.json` file:

### [`nodemon`](https://www.npmjs.com/package/nodemon)

Instead of running `node server.js`, we''ll run `npm run server` which in turn runs `nodemon server.js`. Nodemon is a tool that automatically restarts the server when you''ve edited the `server.js` file. That means you don''t have to constantly switch to your terminal while coding any more!

### [`body-parser`](https://www.npmjs.com/package/body-parser)

This NPM package allows us to parse the `body` of incoming requests. Don''t worry, we''ll talk about requests a little more later.

### Set up the server

After you''ve added `package.json` to your project, run `npm install`. If you don''t have the dependencies on your computer already, it may take a minute or so.

Once that''s done, we''re ready to start coding! Let''s begin with a simple server, but instead of responding in plain text or HTML, we''ll respond with JSON. Paste the following code into `server.js`:

``` {#server.js}
const express = require(''express'')
const app = express()
const port = process.env.PORT || 8080

app.get(''/'', function (request, response) {
  response.json({
    welcome: ''welcome to my API!'' 
  })
})

app.listen(port)
```

When someone visits `/` at our server, we use `response.json` send a welcome response to the user in the form of JSON. Let''s try it out in Postman so you can see what this looks like:

![Example welcome API output in Postman](http://i.imgur.com/FqDDQnF.png)

It may not be much to look at, but you''ve just created your first JSON API! 🎉

If you publish this project to Heroku, you can access your API using any device you want and use the data however you want. You can also add more routes to expand the API as much as you want! But what to make...

I know, let''s make some cash. 💰

## Starting our lemonade business

Create a new file named `products.js` and add the following code:

``` {#products.js}
module.exports = {
  ''lemonade'': {
    name: ''Lemonade'',
    price: ''$1.00''
  },
  ''ice-water'': {
    name: ''Ice water'',
    price: ''$0.00''
  },
  ''chocolate-chip-cookies'': {
    name: ''Chocolate chip cookies'',
    price: ''$1.50''
  }
}
```

That''s right, we''re in the restaurant business. Technically we''re a lemonade stand right now, but big things are on the horizon. You might notice some new code here. What''s `module.exports`?

### Break up your code with `module.exports`

Sometimes our files start to get too long and this makes them difficult to work with. Using `module.exports` alows us to _export_ something from a file so it can be imported and used in other files. We can export a variable, an object, a function, whatever we want.

We can use `require` in our `server.js` file to import another JavaScript file, much like we used `require` to use Express and other packages:

``` {.js}
const anotherFile = require(''./another-file.js'')
```

### Let''s get some data

If you haven''t required your `products.js` file yet, do that now by adding the following line to the top of `server.js`:

``` {#server.js}
const products = require(''./products.js'')
```

This will give you access to all of the product data in our `products.js` file.

Now let''s add a route to view all of our products at once. This should look somewhat familiar:

``` {#server.js}
app.get(''/products'', function (request, response) {
  response.json(products)
})
```

Now, if you request `localhost:8080/products` in Postman, you''ll see all of our products displayed in JSON format.

![Product JSON results in Postman](http://i.imgur.com/7F9r47p.png)

If you try the same thing in your browser, you''ll notice it''s not printed in quite as pretty of a format. That''s one (but not the only) reason we''re using Postman in this lesson.

![Product JSON results in a web browser](http://i.imgur.com/8CCZXFe.png)

What if we want to get just _one_ product? Express offers a cool way to do this. Let''s set up the _route_ first, then look at the code that makes it work.

Here''s how we''ll set up the route in Express:

``` {#server.js}
app.get(''/products/:slug'', function (request, response) {
  // we''ll put more code here in a moment
})
```

What is this `:slug` thing on our route? What do slugs have to do with anything?

![Good morning, flat face!](http://i.imgur.com/C4mTWiI.png)

You might see the term _slug_ from time to time in coding. A *slug* is an all lowercase string with dashes instead of spaces. They look like this: `chocolate-chip-cookies`.

We''re using `:slug` as a parameter in our route. Visitors can put any product in place of `:slug`, like `/products/lemonade` or `/products/ice-water`, and Express will assign the value in the URL (e.g. `lemonade` or `ice-water`) to `request.params.slug` in our server.

Let''s use that variable in our route:

``` {#server.js}
app.get(''/products/:slug'', function (request, response) {
  response.json(products[request.params.slug])
})
```

If we send a request to `localhost:8080/products/lemonade`, `request.params.slug` will contain the string `''lemonade''`. We can use that string to look up a specific product in our `products` object and send back the data that we find.

Try typing `localhost:8080/products/lemonade` into Postman, you should see something like this:

![screenshot of postman](https://i.imgur.com/IXNBCQz.png)

We could use anything we want as a parameter. We could make it `:id`, or `:key`, or `:frodobaggins` if we want. We can even have more than one parameter - take a look at the URL of this page.

You might set up the route like this:

``` {.txt}
courses/:course/lessons/:lesson/:slide
```

And in express, you could access the params like this:

``` {.js}
request.params.course    // course
request.params.lesson    // lesson
request.params.slide     // slide
```

Yeesh, that''s a lot to learn, but now we have a thriving lemonade stand! Give yourself a high-five. 🙏

## Request methods

Okay, our lemonade stand is getting a lot of attention from the neighborhood kids and they''re all opening their own stands. No one wants to buy lemonade from adults anymore. We''re even getting dirty looks from parents.

![That disappointed look](http://i.imgur.com/uWq1aoM.png)

We have to differentiate our business fast. We need to be able to add new products to our API.

So far, we''ve only been _getting_ data from our server, but now we need to be able to _create_ data as well. How do we set this up in Express?

Like this:

``` {#server.js}
app.post(''/products'', function (request, response) {
  // we''ll create a new product here soon!
})
```

It looks a lot like our other routes, but with one important difference: instead of `app.get`, we''re calling the `app.post` function.

Okay... but we already used the route `/products`, so is it ok to use the same route for two different things? Yep! The reason why has to do with the type of request we''re making -- the difference between `app.get` and `app.post`.

When we type a URL into a browser, we''re making a request to the server. But the URL is just a small part of the request. Requests also have all sorts of other properties. One such property is called the *request method*.

### What''s a request method?

There are 4 types of request methods that we''ll use in this lesson, and each one serves a unique purpose:

#### GET

The `GET` method is used when retrieving some information from the server. When you type a web address into a browser, the browser automatically sends the request using the `GET` method.

#### POST

`POST` is used when sending information to a server, usually with the intent to add new data to a collection (like our products). This type of request also comes with a request `body` which contains additional information that is sent along with the request.

When you fill out and submit a form on the web, often you are sending a request using the `POST` method and all of the information you provided will be placed in the `body`.

#### PUT

`PUT` is used when _updating_ some existing information on the server. If you want to change a value, like the price of a product in this example, you would make a `PUT` request. Like `POST` requests, the data you need to send to the server is placed in the `body`.

#### DELETE

The `DELETE` method is used to remove information from a server. Typically the URL provides all the information a server needs to identify what should be deleted.

## POSTing data

Knowing the four main request methods -- `GET`, `POST`, `PUT`, and `DELETE` -- as well as how they''re used is very important when creating an API. We already started writing a `POST` route:

``` {#server.js}
app.post(''/products'', function (request, response) {
  // we''ll create a new product here soon!
})
```

Now let''s make this route do something. We''ll need to get information from the request `body`, translate it into a JavaScript object, and then add it to our `products` object.

This is where `body-parser` comes in handy. To use this dependency, add these two lines after we define the `app` variable:

``` {#server.js}
const bodyParser = require(''body-parser'')
app.use(bodyParser.json())
```

Okay... what the heck is `bodyParser.json`? It''s how Express turns information in the body of a request into data we can use.

You see, every request and response has an attribute called `content-type` that describes how data in the `body` is organized. One of the most common ways of organizing data in an API is using JSON. So `bodyParser.json` tells Express that all incoming data should be converted from JSON to JavaScript objects.

### It''s time to cook

Now that `body-parser` is working for us, we can use information from the body of a `POST` request (or any other type of request for that matter), and save it into our products.

We need two things: the slug or key that we''ll use to save our product into our `products` object, and the data that we want to be associated with it.

Here''s the most basic way we can do it:

``` {#server.js}
app.post(''/products'', function (request, response) {
  const slug = request.body.name.trim().toLowerCase().split('' '').join(''-'')
  products[slug] = request.body
  response.redirect(''/products/'' + slug)
})
```

We generate the slug for our object from our `name` property by replacing all the spaces with dash `-` characters and making the whole thing lowercase:

``` {.js}
const slug = request.body.name.trim().toLowerCase().split('' '').join(''-'')
```

We then save our request body (which `body-parser` has converted to a JavaScript object for us) into our `products` object:

``` {.js}
products[slug] = request.body
```

Then we send the new product back to the user by redirecting them to the URL in our API for that product (`/products/:slug`). This is how we respond to the user after the `POST` request has been successfully processed:

``` {.js}
response.redirect(''/products/'' + slug)
```

### Narrowing the request

Uh oh, there''s a small problem with our code: we''re blindly adding any JSON in the body to our `products`! We''ll want to be a little more picky than that.

Instead of assigning the whole body to our new product (`products[slug] = request.body`), we should only set the fields we care about. Like this:

``` {.js}
products[slug] = {
  name: request.body.name,
  price: request.body.price
}
```

Now if someone tries to post `"carrots": "mmm, my favorite!"` it will be completely ignored.

### Sanitizing our data

We can take it a step further by making sure that our fields are formatted consistently.

Let''s start by removing any extra whitespace from the ends of the `name`:

``` {.js}
name: request.body.name.trim(),
```

Then we can format our price with a `$` at the beginning and limit the amount to two decimal places at the end like this:

```{.js}
price: ''$'' + parseFloat(request.body.price).toFixed(2)
```

Now our products should be a little more predictable and easier to work with.

### Making the request with Postman

We''ve written the code to add a new product. Now let''s see that code in action using Postman. First, click the dropdown that says `GET` and select `POST`.

![Choose POST as the request method in Postman](http://i.imgur.com/rw04nBR.png)

Next, click the word `Body` below the request bar. You''ll see some options at the top:

![Choose the body type in Postman](http://i.imgur.com/dcqzRB3.png)

Check the one that says `raw` and select `JSON (application/json)` in the dropdown that appears on the right.

This is how we tell Postman to send the body in the format that we want. Since we wrote our API to expect JSON, our request won''t work if we don''t check this option. 🙁

Now let''s type some values into our request body (the space immediately below where we selected `raw`):

![JSON for our new root beer product](http://i.imgur.com/SyIGzr2.png)

The last step is to click _Send_. After our server creates the new product, we will be redirected to `/products/craft-root-beer` and our new product will be displayed in the text box at the bottom of the Postman window.

![Postman after we create a new product](http://i.imgur.com/tzuy8iN.png)

Now all we can do is wait, and hope that people like our root beer.

## Deleting and updating items

Good news: people loved the root beer. Adding the word "craft" to the beginning really impressed them. We''ve decided it''s best to just make everything craft. No more regular lemonade, we make craft lemonade now.

Except we can''t take our regular lemonade off of the menu, so for now we''re selling both. We gotta fix that.

### Deleting items

Deleting will look a lot like the `GET /products/:slug` route that we set up earlier:

``` {#server.js}
app.delete(''/products/:slug'', function (request, response) {
  delete products[request.params.slug]
  response.redirect(''/products'')
})
```

Again, we''re setting up a flexible route. We use `:slug` as a parameter that will identify whichever product we want to delete. Let''s try it in Postman. Choose `DELETE` from the dropdown in the top left and put `localhost:8080/products/lemonade` in the request bar:

![All products, minus the lemonade](http://i.imgur.com/mhh2mNT.png)

It should redirect you to the list of products, with no more plain old lemonade.

### Updating fields

We can `GET`, `POST`, and `DELETE` our items now, and life is good. We''re offering craft water now, and everyday we switch the fruit that we use to infuse it. Sometimes it''s watermelon, sometimes cucumber, and it''s becoming a nuisance to send two requests to change the water on our products list every day.

Let''s update our API so we can update products. To make that happen, we''ll use the `PUT` method. Here''s how we do it:

``` {#server.js}
app.put(''/products/:slug'', function (request, response) {
  const product = products[request.params.slug]
  if (request.body.name !== undefined) {
    product.name = request.body.name.trim()
  }
  if (request.body.price !== undefined) {
    product.price = ''$'' + parseFloat(request.body.price).toFixed(2)
  }
  response.redirect(''/products/'' + request.params.slug)
})
```

We''re using the `:slug` parameter to find the correct product, then checking which properties were sent in the request body. We only update the value of a property that has been provided in the body, otherwise we might overwrite something by mistake and end up with missing data.

Let''s test it out in Postman. Send a `PUT` request to `/products/ice-water`, and set the name to "Artisan cucumber water". Just like our `POST`, we''ll have to click `Body`, then choose `raw` and `JSON (application/json)` before we can supply our new name.

![cucumber water](http://i.imgur.com/9imZkVz.png)

Ah, now we can spend less time sending requests, and more time selling fancy water.

## 404 and other status codes

We have our API up and running now. We can `GET`, `POST`, `DELETE`, and `PUT` products from our menu. But when we enter a route that doesn''t exist, we''re not really given any helpful feedback.

![Status: OK, no data shown](http://i.imgur.com/6rmY3tO.png)

See what we mean? Our server says the status is `200 OK` even though no Dippin'' Dots are on the menu. How can things be okay without any Dippin'' Dots??

Let''s first write a function at the very end of our routes (before `app.listen`) to catch any bad requests:

``` {#server.js}
app.use(function (request, response, next) {
  response.status(404).json({
    message: request.url + '' not found''
  })
})
```

We''re using the `response.status` function to send a status code of `404` to the user. You''ve probably seen `404` many times on the web. It means that the requested URL was not found.

There are a bunch of different [status codes](http://www.restapitutorial.com/httpstatuscodes.html) like `404`. They''re used as a standard way to describe the outcome of a request. It would take ages to try and remember all of the codes -- and we won''t make you do that since they''re easy enough to look up -- but there is a lot you can tell just from the first digit:

* `2xx` means the request was a success. `200` is the most common; it simply means the request is OK.
* `3xx` means that our request was redirected to another URL.
* `4xx` are client errors. This might mean the user typed in the wrong URL or they put bad data in the request body.
* `5xx` are server errors. This means something is going wrong on the server side. It could be a bad connection, the server might be having an outage, or there could be too much traffic to the site.

Let''s test our 404 page in Postman. Try to get `localhost:8080/abcdefg`. You should see our 404 message as the response.

![404 /abcdefg not found](http://i.imgur.com/f5gl9w6.png)

Nice! Now let''s fix the issue of our missing Dippin'' Dots. Because `/products/:slug` matches our `/products/dippin-dots` request, we don''t get a `404` status code yet.

If we want to tell users a product does not exist with the `404` status code, we have to write code in our route that checks whether the slug is a real product:

``` {#server.js}
app.get(''/products/:slug'', function (request, response) {
  if (!products[request.params.slug]) {
    response.status(404).json({
      message: ''sorry, no such product: '' +
        request.params.slug
    })
    return
  }
  response.json(products[request.params.slug])
})
```

This checks if our requested product returns a _falsy_ value, like `null` or `undefined`. If so, it responds with a `404` status and a message to the user. The `return` keyword is how we exit from the function early -- there''s no point in running any of the other code if the product doesn''t exist.

![404, Product not found](http://i.imgur.com/U3jTP40.png)

Well, we still don''t offer Dippin'' Dots, but at least we''re giving our customers a straight answer now!

You can apply this same concept to your `PUT` and `DELETE` routes.', NULL, '-Khxn-8TH0o_1EURJy-_', 'Create a todo list API', 'Heroku', 6);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (227, 'css-basic-layouts', 'Use CSS to create a basic website layout', 2, 'Content', NULL, '-KtML_NGSY7PFUL0il1K', 'Create a basic CSS layout', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (228, 'html-design-process', 'Build a pitchboard to learn about the design process', 3, '## Overview

Process is important in any creative endeavour&mdash;it helps us focus on solving problems instead of _making designs_ and will also help us when we have to make changes or create new designs when a client comes back with changes. Just like software development, design has a process.

So, is there an industry-standard process? Can I make up my own process? The answer is a bit of both. There are generally, industry best practices that you''ll find almost everywhere. These include things like wireframing, design comps, site maps, information architecture diagrams and style tiles (there are more!). Most shops will piece these practices together into some sort of _secret sauce_&mdash;but for the most part, it goes something like this:

1. *Ideation and Pitchboards*
2. User Experience and Content
3. Wireframes
4. Design Comps
5. Production
6. Testing

This module will primarily focus on initial ideation and pitchboards&mdash;short, one-page documents that outline what you''re going to build. We''ll revisit more of this process later in the course.

## Ideation and Pitchboards

Every project has to start somewhere. It''s important to get down on paper, a brief overview of what you''re building, who you''re building it for and what your goals are. This will help you stay focused and aide in on-boarding new designers and developers to your project. A typical pitchboard or brief has the following sections:

1. Project Title
2. A short elevator pitch (1 sentence)
3. A longer elevator pitch (2-3 sentences)
4. Three (3) personas
5. Three (3) competitive sites or projects

### Example

#### Title

SuperCorp Players Guide

#### Short Pitch

The SuperCorp Players Guide is the story of our values, how they mold our unique culture, and shape the way we solve problems.

#### Long Pitch

Every decision we make is fundamentally shaped by our values. Whether we’re developing a website that exposes the latest climate data or deciding how best to troubleshoot bugs and communicate their impact to our customers, our values mold our approach to how we do business and develop software. The SuperCorp Players Guide captures this approach, describing the processes, roles, and best practices that are essential to us. It’s meant to be a guide to aid us in choosing projects, building teams, executing work, and interacting with each other... as well as a helpful reminder of why we think and act the way we do. This handbook, then, is both the story of how we have come to our core values and a roadmap to how we solve the problems facing our customers, our company, and our world.

#### Personas

* Client/Partner: Prospective or current business partner
* SuperCorp Recruit: Prospective new hire
* SuperCorp Employee: Current SuperCorp employee

#### Comps

* Valve Employee Handbook
* Dungeons and Dragons
* Information Architects

### Short and Long Elevator Pitches

The two _pitches_ that make up your pitchboard/project brief are the most important part of the document. The idea here is to initially distill your idea (or the ideas/goals of the project if you''re working with a client) in as short a format as possible. Think about only having a short elevator ride to pitch your idea to an investor or interested party&mdash;use that motivation to write your first draft. Be brief and to the point, knowing that you can add more detail in your long-form pitch.

When someone new to the project is done reading the first two paragraphs or your document--they should have a firm grasp of what the work is all about and what the clients expects.

### Personas

Personas are a realistic representations of the core audience of your site, application or product. They help you focus on a user other then yourself&mdash;hopefully influencing you and your team to make design decisions that are in the best interest of the user you''re trying to reach.

*Detailed reading on personas:*

* [Personas (Usability.gov)](https://www.usability.gov/how-to-and-tools/methods/personas.html)
* [Personas: Why and How You Should Use Them](https://www.interaction-design.org/literature/article/personas-why-and-how-you-should-use-them)

During the ideation and pitchboard stage, you don''t need to completely build a full persona profile (such as the 1-2 page representations noted in the detailed reading). Generally a name or title and brief description are all that''s necessary. As you work through your design process, you''ll create more detail around (or even change) your initial persona concepts.

### Comps (Comparables)

When you go to buy or sell a car or house (or any bigger-ticket item, really), you usually compare the asking price to the price of similar vehicles or have a Realtor pull recently sold houses in the area you''re looking to buy. For our pitchboard, comps are sites or applications that currently exist that you''d like to remember in some way. Generally, comparable websites fall into three categories:

1. Competitors (Google, Bing and Yahoo)
2. Feature (I like the checkout feature of Amazon)
3. Design/Content (I like the way this looks and reads)

Comps help set the pace for competitive analysis and can also give you some help when describing your project to someone unfamiliar with the subject.

## User Experience and Content

Once you have an initial idea and a pitchboard (or some other pre-production ideation document) you can begin to develop content and work out some of the core user interactions of the site.

* Content is crucial to good design. In an ideal world, we have complete content to design against at the onset of the project.
* Before we wireframe, we need to know how much, and what kind of content we’ll be dealing with.
* Content should be crafted using good web writing techniques.
* Make sure you identify the site or application''s primary _call to action_&mdash; what are you trying to get your users/visitors to do?

We''ll explore the user experience and content process in later modules.

## Wireframes

Wireframes help us organize all the content we (hopefully) completed in previous steps and build out user interactions without committing to full-scale development. You can work through almost all of your interaction issues in the wireframe stage and even test changes on real users. Here are a few things to remember about wireframes:

* Low fidelity mockups that help to place content and other major screen elements.
* Wireframes don’t need to be in color&mdash;less is definitely more.
* You can sketch wireframes or use one of the many online or desktop tools.
* Wireframes should cover all major layouts and user interactions on a site.

## Design Comps

* Core design step in the overall design process.
* Translate wireframes and content into complete design ideas.
* Typical tools include Photoshop, Sketch and Browser/Markup.
* This step will help you define your HTML and CSS patterns (in the production step)

## Production

* Depending on the project, HTML and CSS should be broken down to core components and defined in a pattern library (see Bootstrap).
* Good markup matters&mdash;take care in marking up your content and be sure to use elements for their semantic meaning, not their style (style can be changed thanks to CSS).
* You may have to work in other frameworks like Rails, Django or Nod

## Testing

* Generally, we test along the way using our browser’s developer tools (Chrome) and cross checking our work in other locally installed browsers.
* We can also test the design itself by having users perform tasks and measuring the results.
* It’s also a good idea to test the performance of the website by measuring its response time (usually in milliseconds)&mdash;faster is always better', NULL, '-KuAzyWyKNAb0m2vEM6_', 'Create a Pitchboard for a space exploration startup company''s homepage', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (203, 'css-sass-intro', 'Use tools like Sass to more easily manage CSS', 2, '## Where CSS falls short

We use CSS to design our websites, but in order to create a _consistent_ design, we need to reuse a lot of values, like in these elements:

``` {.html}
<a>I''m a link</a>
<button>I''m a button</button>
```
~~~ {.result}
<a href="#" style="color: #3b6e98;">I''m a link</a>

<button style="background-color: #dfeaf3; color: #3b6e98; border-color: #3b6e98">I''m a button</button>
~~~

We''re using the same blue for the:

* `color` of links
* `color` of buttons
* `border-color` of buttons

And then for the `background-color` of the button, we use a slightly lighter version of that same blue. To accomplish this effect, we might write this CSS:

``` {.css}
a {
  color: #3b6e98;
}

button {
  color: #3b6e98;
  border-color: #3b6e98;
  background-color: #bbd2e4;
}
```

As you can see, we have to write the same color, again and again. To get the lighter color, we had to bring out a color picker and manually create a lighter version.

It''s not too bad in this simple example, but on a real website, it''s not uncommon for the CSS to grow to hundreds or even thousands of lines. Imagine you have this color in 50 different places, across 30 different files, with 10 different lighter, darker, or more transparent versions that you''ve also created, then someone asks a simple question:

<blockquote> 
  "Hey, we want to put a fun Halloween theme up on the website for a few days. Can you update that blue to orange instead?"
</blockquote>

This is your life now:

![Wrangling CSS](https://i.imgur.com/Q3cUg29.gif)

## Programming CSS with Sass

It seems like there should be a better way. If we were writing JavaScript, this would be an obvious place for a variable. Then to create a lighter version, we could use a function.

This is where *Sass* comes in:

![Sass logo](http://i.imgur.com/4xWKrd5.png)

Sass is a *CSS preprocessor* that adds features to make CSS easier to manage. You can also think of preprocessors as programs that convert information from one format to another, like from Sass''s format to CSS.

For example, our earlier example could be rewritten with Sass as:

``` {.scss}
@use "sass:color";

$primary-color: #3b6e98;

a {
  color: $primary-color;
}

button {
  color: $primary-color;
  border-color: $primary-color;
  background-color:
    color.scale($primary-color, $lightness: 50%);
}
```

### Breaking down the Sass code

We first define a `$primary-color` variable:

``` {.scss}
$primary-color: #3b6e98;
```

All variables in Sass begin with `$`. We can reuse that variable wherever we want by using the name of the variable anywhere we want its value to appear:

``` {.scss}
color: $primary-color;
```

Then finally, we create a lighter version of the color with Sass''s  `color.scale` function:

``` {.scss}
background-color: color.scale($primary-color, $lightness: 50%);
```

Its first argument is the color we want to change, then the second argument is the percentage by which we want to change the lightness.

### Meeting our original challenge

Suddenly, updating our blue theme to an orange one doesn''t seem very difficult. We only have to change one line:

``` {.scss}
$primary-color: #755c30;
```

And the rest of our code will update accordingly, no matter how much code we have. The end result is:

~~~ {.result}
<a href="#" style="color: #755c30;">I''m a link</a>

<button style="background-color: #e5d7bf; color: #755c30; border-color: #755c30; color: #755c30">I''m a button</button>
~~~

## Running Sass in a terminal

Start the project for this lesson now (though don''t worry about the criteria yet), then clone the directory to your computer. Inside that directory, create a file named `style.scss` (the `.scss` is short for _Sassy CSS_). Then paste the Sass we just wrote into the file:

``` {#style.scss}
$primary-color: #3b6e98;

a {
  color: $primary-color;
}

button {
  color: $primary-color;
  border-color: $primary-color;
  background-color:
    color.scale($primary-color, $lightness: 50%);
}
```

Just like `live-server`, Sass is a developer tool that can be installed with `npm`:

``` {.sh}
npm install --global sass
```

Once installed, you can *compile* your Sass into CSS with:

``` {.sh}
sass style.scss:style.css
```

The argument provided to the `sass` command has three parts:

1. The input or source file: `style.scss`
2. A colon (`:`)
3. The output or destination file: `style.css`

Once the command finishes, which should only take a couple of seconds, you''ll see this new `style.css` file:

``` {#style.css}
a {
  color: #3b6e98;
}

button {
  color: #3b6e98;
  border-color: #3b6e98;
  background-color: #93b7d5;
}

/*# sourceMappingURL=style.css.map */
```

Ignore the last line of this CSS file and the other file created by the compiler (`style.css.map`) for now, it''ll be explained later in this lesson.

_This_ is the file you''ll actually link to in your browser:

``` {.html}
<link href="/style.css" rel="stylesheet">
```

~~~ {.warning}
Any time you make a change to `style.scss`, you''ll have to run the `sass` command again to update `style.css`. That''s kind of annoying, but don''t worry, we''ll find a way around it later in the lesson. 😉
~~~

## Organizing projects with compiled code

Before we go any further, let''s talk about organization. When you have compiled files and also *source files* (like our `.scss` file) in the same project, things can get pretty confusing -- especially as your project grows.

We recommend creating separate `source` and `compiled` directories to keep things straight:

![Sample project directory](https://i.imgur.com/l3P2w31.png)

The files in `source` are what you actually work on, but you won''t link to them from your pages because the browser can''t understand them. The files that the browser can read are saved in `compiled` and you should _never_ edit them directly.

In this project, you can compile all of the Sass files in the `source/scss` directory and save it to the `compiled/css` directory with this command:

``` {.sh}
sass source/scss:compiled/css
```

## Minification: compiling to tiny files for fast page loads

Large files download more slowly than smaller files, which is especially important for people visiting your site on slower connections, like on mobile phones.

Fortunately, web browsers don''t need nicely formatted code. For example, this code:

``` {.css}
button {
  color: #3b6e98;
  border-color: #3b6e98;
  background-color: #93b7d5;
}
```

Can be read by web browsers just as easily if it looked like this:

``` {.css}
button{color:#3b6e98;border-color:#3b6e98;background-color:#93b7d5}
```

And since humans don''t usually need to read the compiled file, we can actually add a new argument to strip out any spaces, new lines, and other unnecessary characters:

``` {.sh}
--style=compressed
```

So now we can compile our Sass file into a *minified* CSS file with this command:

``` {.sh}
sass source/scss:compiled/css --style=compressed
```

### Source maps: seeing your original code in the devtools

So now we''re using minified CSS to style our pages, but what if we encounter a bug and want to find out which line in our Sass file is responsible? If we only look at the minified CSS file, all of our styles appear on line 1, which isn''t helpful when we want to fix a bug in our Sass file.

What is helpful, though, are the last line of our CSS file:

``` {.css}
/*# sourceMappingURL=style.css.map */
```

And the other file that the `sass` compiler creates when it runs (`style.css.map`). The line at the end of the CSS file is a comment that tells the browser where our source files are and which line each rule _maps_ to. When we open the devtools, the `button` rule will report that it''s coming from line `10` of `style.scss`:

![Rule in Chrome devtools, with style.scss](https://i.imgur.com/tQA9Q4K.png)

And when we click on the `style.scss:10` link, we''ll be taken to the correct line of our source file, where we can see _exactly_ how these styles were generated:

![style.scss in Chrome devtools](https://i.imgur.com/iPXpBdw.png)

This feature comes totally free with Sass too. Yay!

## Automatically compile when you make changes

When we create styles, we''ll inevitably save our changes, compile them, and see what they look like in a web browser. We probably won''t like what we see, and so we''ll make some more changes, save them, and compile them all over again.

This gets monotonous really fast. Fortunately there is a way `sass` can automatically look for any changes to your Sass files and compile them to CSS as soon as any changes are detected:

``` {.sh}
--watch
```

When you run `sass` with this argument, your Sass files will be compiled into CSS right away _and_ any time you make changes to them. `sass` will keep compiling changes until you tell it to stop (by pressing `Ctrl`+`C`).

This is a great way to tweak your Sass while working on a project. Here''s what the full command now looks like:

``` {.sh}
sass source/scss:compiled/css --style=compressed --watch
```

## Rapid design using math and functions

We''ve already seen how to create a color variable in Sass:

``` {.scss}
$primary-color: #3b6e98;
```

You can also create variables that contain more than just colors. All you need to remember is to start the variable with a dollar sign (`$`):

``` {.scss}
$serif-fonts: Georgia, Cambria, "Times New Roman", serif;
$font-base-size: 20px;
```

Hmm. That looks like enough to set the default font for our pages:

``` {.scss}
body {
  font-family: $serif-fonts;
  font-size: $font-base-size;
}
```

But what about our headings? They''ll definitely be bigger than `18px`. Wouldn''t it be nice if we could use `$font-base-size` for each heading and scale each one so our `h1` is bigger than our `h2` and our `h2` is bigger than our `h3`?

Yes, that would be nice and Sass actually lets us do that! Check this out:

``` {.scss}
$font-base-size: 20px;

h1 {
  font-size: $font-base-size * 2.25;
}

h2 {
  font-size: $font-base-size * 2;
}

h3 {
  font-size: $font-base-size * 1.75;
}
```

Here''s what the resulting CSS looks like:

``` {.css}
h1 {
  font-size: 45px;
}

h2 {
  font-size: 40px;
}

h3 {
  font-size: 35px;
}
```

We are now free to use addition, subtraction, multiplication, and division. Sass also remembers the type of unit we are working with (e.g. `px` or `%`).

### Functions: hard work made easy

Earlier in this lesson we got a sneak peak of a built-in Sass function named `color.scale`:

``` {.scss}
button {
  color: $primary-color;
  border-color: $primary-color;
  background-color:
    color.scale($primary-color, $lightness: 50%);
}
```

There''s another line at the very beginning of `style.scss` that is required to use `color.scale` too:

``` {.scss}
@use "sass:color";
```

This line gives you access to a *Sass module* named `sass:color`. A Sass module is basically a named group of styles, variables, and functions. Sass organizes all of its functions into [seven different modules](https://sass-lang.com/documentation/modules):

* `sass:color`
* `sass:math`
* `sass:string`
* `sass:list`
* `sass:map`
* `sass:selector`
* `sass:meta`

When you want to use a function, first find the module it''s in, then put a `@use` followed by the name of the module surrounded by quotes (`"`) at the top of your SCSS file.

Functions like `color.scale` are a huge time-saver when it comes to working with colors. I mean, how fast could you do the math to make `#3b6e98` 50% lighter? And what if 50% wasn''t light enough? Do it again, that''s what! 😵

When designing a website, we often want to make a color a lighter, darker, more red, more blue, gray, kind of see-through... well, you get the point. There are lots of ways a color can be changed, but the math to do it takes a lot of time and we''ve got way better things to do with our time!

Thankfully, Sass has lots of functions that make our lives way easier. Just to name a few:

* `color.scale`
* `color.lighten`
* `color.darken`
* `color.grayscale`
* `color.complement`
* `color.invert`
* `color.fade-out` -- whoa, Sass functions can have hyphens in them!

In case you missed it, here''s [the full list of Sass modules](https://sass-lang.com/documentation/modules/list).

## Nesting styles to avoid repetition

Have you ever noticed that HTML has lots of elements inside elements:

``` {.html}
<nav>
  <ol>
    <li>
      <a href="/">Home</a>
    </li>
    <li>
      <a href="/about">About</a>
    </li>
  </ol>
</nav>
```

While everything in CSS is flat, requiring you to write a lot of repetitive selectors:

``` {.css}
nav {
  background-color: #885053;
}

nav ol {
  list-style: none;
}

nav ol a {
  font-weight: bold;
  color: white;
}

nav ol a:hover {
  text-decoration: underline;
}
```

CSS selectors can be tricky enough to work with. Wouldn''t it be nice if we didn''t have to waste time -- and risk unnecessary typos -- typing the same selectors over and over?

Sass to the rescue, once again!

As it turns out, there is a pretty simple way to approach this problem: nest selectors and styles inside of each other. Here''s how the CSS from above would look using Sass''s nested structure:

``` {.scss}
nav {
  background-color: #885053;
  ol {
    list-style: none;
    a {
      font-weight: bold;
      color: white;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
```

We can much more clearly see how nested elements affect the appearance of our HTML. We haven''t completely gotten away from selectors, but this is quite an improvement over plain CSS!

Any `ol` element _inside_ a `nav` element won''t be styled as a list. Furthermore, any `a` elements inside of one of those `ol` elements will be bold and white.

The `&:hover` is a little more tricky. In Sass, `&` means "my parent." In our case, `&:hover` is nested in an `a` selector, which means that `a` is the parent. Any time someone hovers over an `a` inside an `ol` that is in a `nav`, the text will be underlined.

Just like in a physical space, the right organization scheme can make you more productive!

![Use the right organization strategy](http://i.imgur.com/n2Std6N.png)


We''re not limited to element selectors either. We can use IDs, class names, or any other kind of CSS selector we want. Like this:

``` {.scss}
.row {
  .column {
    background-color: #c6ecae;
  }
}
```

## Organizing your styles with `@import`

Hey, while we''re thinking about organizing our Sass code, there''s one more feature that is really great for keeping our styles nice and tidy and you''ve already seen it in use: modules!

That''s right, not only does Sass provide you with a bunch of modules containing functions, you can also create your own and organize your project into many SCSS files. 😎

Suppose we still have our styles defined in `style.scss`, but we want to move our variables into their own file named `_variables.scss`:

``` {#_variables.scss}
$primary-color: #3b6e98;
$serif-fonts: Georgia, Cambria, "Times New Roman", serif;
$font-base-size: 18px;
$font-grow-size: 6px;
```

In `style.scss`, we could still use all of those variables by first including `_variables.scss` as a module:

``` {#style.scss}
@use "variables";

a {
  color: variables.$primary-color;
}
```

On the first line of our Sass file, we use `@use` to pull in another file. The name of the file follows, surrounded by quotes. The file''s extension, `.scss`, and the `_` at the beginning of the filename are optional.

In the rest of our SCSS, we will use the module name followed by a period (`variables.` in this example) to access variables we defined in `_variables.scss`. It''s okay if you forget this part, the `sass` command will complain when a variable is used without a module name.

Notice that we named the file `_variables.scss` instead of `variables.scss`. When a file name starts with an underscore (`_`), Sass will not compile it into its own CSS file.

Now we have two Sass files in our project: `_variables.scss` and `style.scss`.  When we run `sass`:

``` {.sh}
sass source/scss:compiled/css --style=compressed
```

We can see that Sass still only generates one CSS file (`style.css`) and one source map (`style.css.map`):

![](https://i.imgur.com/rMjgUoo.png)

~~~ {.note}
#### What goes where: a refresher

* In the `head` of your HTML files, link to your compiled CSS files. You''ll find them in your `compiled/css` directory and they''ll have the file extension `.css`.

* Link to _all_ your compiled CSS files, and _only_ those. If you link to Sass files, the browser won''t be able to read them.

* Your Sass files should all go in your `source/scss` directory and have the file extension `.scss`. This is where you will write your styles.

* Any Sass file you want to use should start with `_`. This will make sure it does not get compiled into CSS. 
~~~
', NULL, '-KbQF13kfTnH7S8dVLYn', 'Create a Sassy set of components', 'GitHub Pages', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (204, 'css-spacing-and-layout', 'Control the spacing and layout of pages with CSS', 2, '## CSS Spacing

We''ve learned a lot of CSS so far. 

![young lion apprentice](https://media.giphy.com/media/3o6Zt1AH9d4o2nJBYs/giphy.gif)

But if we want to create our own custom layouts, there is still _plenty_ more to know.

### Padding, margin, and friends

We''ve used padding and margin quite a bit already. Here are short explanations of each:

* `padding` creates space between the edge of an element and its content
* `margin` creates space between the current element and others on the page

Both properties create space, but there is a right and a wrong way to use both. The general rule is this:

<blockquote>
<p>Use margin when you want to add space <em>between</em> elements and use padding when you want to create space <em>inside</em> an element.</p>
</blockquote>

This seems obvious, but there are times when you can create the same layout by using padding _or_ margin, and in these cases there is usually a right choice and a wrong one. Here are some *common misuses*:

* Using padding to create space between headings and paragraphs
* Using margin to create space between content elements (`p`, `h2`, etc.) and the edge of their container
* Using padding on images to create some breathing room

When deciding to use padding or margin, ask yourself whether you want to create space _between_ elements, or _within_ one. The more deliberate you are with your CSS across the board, the better your code will be.

### The box model

Try interacting with the values in the example below.

<iframe width="100%" height="410" src="//jsfiddle.net/gap_stuth/agz46b4j/2/embedded/result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

You''ll see this colored box diagram a lot, it''s often called the *box model*. The idea behind the box model is that your content, `padding`, `margin`, and `border` all influence the size of your element. Knowing how these properties work and affect other elements is an important part of creating good-looking layouts.

The box model even makes an appearance in your element inspector. Open the developer tools by right clicking anywhere on the page and selecting "inspect element".

If you move your cursor over an HTML tag in the _Elements_ tab, you''ll see the browser highlight the element''s content, `padding`, `margin`, and `border` with different colors.

![developer tools box model](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/devtools-box-model.png)

And if you look at the _Styles_ tab, you''ll see a box model representation of the currently selected element.

![style tab box model](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/styles-box-model.png)

The element inspector is a great place to experiment with different layouts, and tweak them to your liking. The box model is just one of the many features that make life easier for anyone writing CSS.

Interacting with the inspector may seem clunky at first, but the more you use it, the more natural it will feel.

## Some layout quirks

When learning to space your elements, you might notice that CSS margins behave strangely. It can be pretty frustrating when we think something is going to behave one way, and it just... doesn''t.

![brain gif](https://media.giphy.com/media/ftBY7RCzO9OUM/giphy.gif)

CSS can definitely be weird, but after a while you begin to notice that it''s usually the same few issues popping up and there are a few handy ways of dealing with most of them. Let''s go over some common CSS layout quirks.

### Body margin

The default margin for the `body` element is `8px`. If you want your content to reach the edge of the page, you''ll need to set this to `0`.

``` {.css}
body {
  margin: 0;
}
```

### Margins overlap

If you have two elements next to each other -- either vertically or horizontally -- their margins will overlap and the distance between them will be the _larger_ of the two margins.

For example, if you have a paragraph with a `10px` margin below a heading with a `15px` margin, they will only be `15px` apart. This is why sometimes spacing doesn''t change when you increase or decrease margins, just like in the demonstration below.

![http://i.imgur.com/APLV3xD.gif](http://i.imgur.com/APLV3xD.gif)

You can see this in action by inspecting any heading or paragraph on this page.

### Overflow and margin

By default, the top and bottom margin of an element will extend beyond the boundaries of its parent. If you want an element''s margin to be completely enclosed inside its parent element, you must add padding to the parent element or set the parent''s `overflow` to `auto`.

Try out the example below to see it in action. It may help to inspect the child element to see the margins forced inside the parent element with a non-default `overflow` value and a non-zero `padding`.

<iframe width="100%" height="400" src="//jsfiddle.net/gap_stuth/5vxhfoun/2/embedded/result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Floats

We don''t cover the CSS `float` property in this class specifically because of the number of unusual layout quirks you''ll run into when using it. 😥

~~~ {.note}
Some some CSS frameworks such as Bootstrap and Skeleton make use of floats. If you are interested in web design, it''s valuable to know how to use them. If you want to learn more about floating elements, start with CSS tricks guide: [All About Floats](https://css-tricks.com/all-about-floats/).
~~~

## Block, inline, and inline-block

We''ve talked a little bit about inline and block elements in the [Build a simple webpage using basic HTML elements](../html-editor-and-basic-elements/3) lesson. Here''s a quick refresher: 

* *Block elements* use the whole width of their container and are always shaped like blocks/rectangles. Some examples of block-level elements are `div`, `p`, `h1`-`h6`, `ul`, `ol`, and `li`.
* *Inline elements* use the minimum amount of space needed and are not rectangular in shape. They behave a lot like text does in a paragraph. Some examples of these are `span`, `a`, `strong`, and `small`.
* *Inline-block elements* only take up the width that they need, but they are shaped like blocks so you can set `padding`, `margin`, `width`, and `height` just like you would a block element Some examples of these are `img`, `button`, and `input`.

Even though each element has a default display style, those display styles can actually be changed with CSS. 😎

### Changing an element''s display type

Suppose you have a series of products and want them to appear side-by-side on the page. Because the products exist in block elements (a `div` perhaps), each product will appear on its own line, regardless of the size of the elements.

![sidebar](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/bear-before1.png)

If we change the products to display as `inline-block`, we can show them side-by-side:

``` {.css}
.product {
  display: inline-block;
}
```

![sidebar](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/bear-after1.png)
Booyah! Now suppose you want to make a sidebar like the one in the [Bootstrap Docs](http://getbootstrap.com/css).

![sidebar](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/sidebar.png)

`a` tags are inline elements, but we want them to stack on top of each other and take up the entire width of the sidebar. We can change them to display as block elements to accomplish this:

``` {.css}
.sidebar a {
  display: block;
}
```

![sidebar](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/sidebar-before-after2.png)

Now our `a` tags stack on top of each other. 😃

~~~ {.note}
*`inline-block` and `%` widths*

Using inline-block with `%` widths may not work quite the way you expect, even if the percentage values are correct. This is because inline-block elements actually render a space character between each tag, even when you''re just trying to indent your code for readability.

[There are a few decent hack solutions](https://css-tricks.com/fighting-the-space-between-inline-block-elements/) to this problem, but if you want perfect columns, you''ll probably want to [learn to use floats](https://css-tricks.com/all-about-floats/) or use `flexbox` (which we''ll cover later this lesson).
~~~

## Centering content

It''s fairly common to want to center text and other elements either on a page or inside of other elements and the good news is that CSS allows us to do that.

But which property do we change? Well, there''s no _one_ property that works the way we want it to every time. There are a _few_ different ways to center elements in CSS and each one is just a little different.

### Text, `inline`, and `inline-block` elements

Centering text in CSS is pretty straightforward. Say you''re making an ad for a goat sweater you made and it has a heading, a paragraph, and a button. The HTML will look something like this:

```{.html}
<div class="featured-goat-sweater">
  <h2>Evening Goat Sweater</h2>
  <p>Your goat will look warm and casual in this premium evening goat sweater.</p>
  <button>View product</button>
</div>
```
![style tab box model](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/goat-uncentered.png)

If you want to center the heading, all you need to do is adjust the `text-align` property on your element:

```{.css}
.featured-goat-sweater h2 {
  text-align: center;
}
```
![style tab box model](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/goat-h2-centered.png)

Voilà! The `h2` element is perfectly centered. It looks kinda weird though. Can we center all of it? Let''s give it a shot:

```{.css}
.featured-goat-sweater {
  text-align: center;
}
```
![style tab box model](https://raw.githubusercontent.com/stuartpearman/lesson-images/master/goat-centered.png)

Now we''re targeting all of the elements inside `.featured-goat-sweater` and it works! It centered the heading, the paragraph, and the button.

The property is called `text-align`, but it also centers `inline` and `inline-block` elements. The trick is that you have to apply the `text-align` style to the _parent_ element.

So what happens when you try to set the `text-align` style directly on the `button` element? It will center the text _inside_ the button instead of the button itself. Setting `text-align` on an element you want to center will never work.

### Block elements

Using `text-align: center` won''t center block elements. What''s up with that?

Inline elements like `span`, `strong`, and `em` are almost always used directly in a line of text. Inline block elements behave in much the same way. And block elements take up the whole width of their container by default, so it kind of makes sense that `text-align: center` works on inline elements, but not on block elements.

So how _do_ we center a block element? We can do it by setting the left and right margin to `auto`, like this:

``` {.css}
margin: 0 auto;
```

Remember, this also sets the top and bottom margin to `0`, it''s the same as writing this:

``` {.css}
margin-top: 0;
margin-right: auto;
margin-bottom: 0;
margin-left: auto;
```

Also remember that a block element can only be centered if its width is _less_ than its container. If the element takes up the entire width or more, it won''t have room to move anywhere and can''t be centered.

### Centering all the things!

Centering in CSS is such a hot topic that there is a complete guide to walk you through it. When in doubt, read the manual:

[Centering in CSS: A Complete Guide](https://css-tricks.com/centering-css-complete-guide/)

### What about vertical centering?

A short time ago, our answer would have been "good luck." But now it''s totally possible to center content vertically!

And that brings us to our next topic...

## Flexbox!

We''ve seen a few nice tricks so far, but this may be the ultimate trick to have in your arsenal. *Flexbox* is a collection of tools introduced in CSS3 which simplifies layouts that would otherwise be extremely difficult with just CSS.

Flexbox has some properties that are meant to target the parent element, and some that are meant for child elements. To activate Flexbox, there is one CSS property that you''ll _always_ set on the parent element:

``` {.css}
display: flex;
```

This allows the parent element to dynamically control the way its children are aligned and distributed. Once you activate Flexbox on the parent, there are a ton of cool layout properties you now have access to. Let''s take a look at a few common layouts you can create with Flexbox.

### Columns

Flexbox allows you to easily split your content into columns of different sizes and ratios. Consider this example:

``` {.html}
<div class="parent">
  <div class="content" id="content1">...</div>
  <div class="content" id="content2">...</div>
  <div class="content" id="content3">...</div>
</div>
```

You can create three perfect columns with the `flex-grow` property. You can even set `margin` and `padding` to create space between your columns, and Flexbox will still work just fine.

Look at the result tab below to see for yourself: 

<iframe width="100%" height="300" src="//jsfiddle.net/gap_stuth/cdwx5oqn/embedded/css,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

If you want three columns, but you really want one of them to be larger than the other two, you can adjust `flex-grow` on individual elements. Maybe you want the first column to take up half of the screen, and the other two columns to have a 1:2 ratio. Let''s add some CSS to the end of our first example:

```{.css}
#content1 {
  flex-grow: 3;
}

#content2 {
  flex-grow: 1;
}

#content3 {
  flex-grow: 2;
}
```

It would end up looking something like this:

<iframe width="100%" height="300px" src="https://jsfiddle.net/gap_stuth/c9wLq7ej/2/embedded/result/"></iframe>

Not so pretty, is it? When a paragraph shrinks below a certain width, it''s not easy to read. This is where the `flex-basis` property comes into play. Use it to set a minimum width for our child elements.

You can also indicate that the columns in a Flexbox should wrap when they get too small using `flex-wrap`.

<iframe width="100%" height="300" src="//jsfiddle.net/gap_stuth/kwnufees/3/embedded/css,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Align and distribute content

Flexbox also allows you to decide how you want items to be distributed, as well as how they are aligned vertically.

### Distributing content

You can change the way static items are distributed within their container using the `justify-content` property. Use this property on the parent element (the element with `display: flex`).

Try out some different values in the example below:

<iframe width="100%" height="354" src="//jsfiddle.net/hcodelab/a8uwnfpg/1/embedded/result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Alignment

You can also adjust element alignment easily using Flexbox. How elements are distributed describes how they are spread out across the space they occupy, whereas alignment describes how elements line up with each other. You can align their tops, bottoms, and you can even center them vertically.

<iframe width="100%" height="370" src="//jsfiddle.net/hcodelab/268fLz17/1/embedded/result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

### Becoming a flex master

We''ve only introduced some of the amazing things you can do with Flexbox. If you go even further, you''ll find there''s a lot more powerful and fun things to learn!

[A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/) is the best resource out there to learn more. Check it out and come back to it whenever you need it, there''s no need to figure Flexbox out on your own!', NULL, '-Kapm87BvFi5CUT7bJIb', 'Create a professional-looking personal site or portfolio', 'Surge', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (229, 'html-personas', 'Create detailed personas to help focus design on user goals', 3, '## Personas

As we discussed in the previous module, personas are a realistic representation of the core audience of your site, web application or product. They help you focus on a user other then yourself&mdash;when making design and user experience decisions. In this module, you''re going to be expanding on the personas you developed during the _Pitchboard_ stage.

Quick, short personas are fine for the ideation stages of a project (pitchboards)&mdash;but as the idea matures, you need to build a more detailed and concrete user archetype. Review the reading below and then move on to building out more details using the worksheet below:

*Additional reading on personas:*

* [Personas (Usability.gov)](https://www.usability.gov/how-to-and-tools/methods/personas.html)
* [Personas: Why and How You Should Use Them](https://www.interaction-design.org/literature/article/personas-why-and-how-you-should-use-them)
* [A Closer Look at Personas](https://www.smashingmagazine.com/2014/08/a-closer-look-at-personas-part-1/)

### Worksheet

Use this persona worksheet to build out a more detailed story for your users:

* [Persona Worksheet (Core Poster)](https://creativecompanion.wordpress.com/2011/05/05/the-persona-core-poster/)', NULL, '-KuB11yH14clfFEbmlFD', 'Detailed Personas', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (230, 'css-responsive-design', 'Use @media queries to build a responsive mobile website', 3, 'Media Queries', NULL, '-KuBCKjy2FmmZ6EKlXKO', 'Create a mobile-friendly food truck menu', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (231, 'css-forms-mini-project', 'Mini Project: Bootstrap Forms', 3, '## Mini Projects

Mini Projects are focused work based on a previous module''s content. In this mini project, you''ll take the skills you learned using the Bootstrap CSS framework and apply them to building a simple form. Before you get started, make sure you brush up on the Bootstrap Form documentation (linked on the next page).

## Additional Reading and Resources

* [Forms (HTMLDog)](http://htmldog.com/guides/html/beginner/forms/)
* [Bootstrap 4 Form Guide](http://getbootstrap.com/docs/4.0/components/forms/)
', NULL, '-Kwbgjd_9EhhzAObB8-B', 'Create an Athlete Registration Form for a Race', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (232, 'html-dash-personal-site', 'Dash Project 1: Build a Personal Website', 4, '## Dash

These modules are completed in a program called [Dash](https://dash.generalassemb.ly). It will walk you through the steps and show you it''s own progress&mdash;when you''re finished, take a screenshot to commit to GitHub.

### Dash Project #1

1. Login or create an account on [Dash](https://dash.generalassemb.ly)
2. Complete all 4 sections of: _Project 1: Build a Personal Website_
3. Take a screenshot of the completed project screen', NULL, '-KywH0_BDe3sGpGYwMbv', 'Build a Personal Website', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (233, 'css-dash-responsive-blog-theme', 'Dash Project 2: Responsive Blog Theme', 4, '## Dash

These modules are completed in a program called [Dash](https://dash.generalassemb.ly). It will walk you through the steps and show you it''s own progress&mdash;when you''re finished, take a screenshot to commit to GitHub.

### Dash Project #2

1. Login or create an account on [Dash](https://dash.generalassemb.ly)
2. Complete all 4 sections of: _Project 2: Build a Responsive Blog Theme_
3. Take a screenshot of the completed project screen', NULL, '-KywK4h4dQ404nycnsoq', 'Build a Responsive Blog Theme', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (234, 'html-dash-small-business-website', 'Dash Project 3: Build a Small Business Website', 4, '## Dash

These modules are completed in a program called [Dash](https://dash.generalassemb.ly). It will walk you through the steps and show you it''s own progress&mdash;when you''re finished, take a screenshot to commit to GitHub.

### Dash Project #3

1. Login or create an account on [Dash](https://dash.generalassemb.ly)
2. Complete all 4 sections of: _Project 3: Build a Small Business Website_
3. Take a screenshot of the completed project screen', NULL, '-KywLv_4fLwPkU-YonhW', 'Build a Small Business Website', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (235, 'css-dash-css-robot', 'Dash Project 4: Build a CSS Robot', 4, '## Dash

These modules are completed in a program called [Dash](https://dash.generalassemb.ly). It will walk you through the steps and show you it''s own progress&mdash;when you''re finished, take a screenshot to commit to GitHub.

### Dash Project #4

1. Login or create an account on [Dash](https://dash.generalassemb.ly)
2. Complete all 4 sections of: _Project 4: Build a CSS Robot_
3. Take a screenshot of the completed project screen', NULL, '-KywNKWc-INhcklIJXGH', 'Build a CSS Robot', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (236, 'js-dash-madlibs', 'Dash Project 5: Madlibs Game', 4, '## Dash

These modules are completed in a program called [Dash](https://dash.generalassemb.ly). It will walk you through the steps and show you it''s own progress&mdash;when you''re finished, take a screenshot to commit to GitHub.

### Dash Project #5

1. Login or create an account on [Dash](https://dash.generalassemb.ly)
2. Complete all 5 sections of: _Project 5: Build a Madlibs Game_
3. Take a screenshot of the completed project screen', NULL, '-KywSFS3ip0VFX3XbnGp', 'Build a Madlibs Game', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (237, 'html-wireframes', 'Wireframes', 3, '## Wireframes

Wireframes are the intermediary step between concept and final design. They should show enough detail so that developers and stakeholders can make informed decisions from them, but not detailed enough that they communicate any real design direction. Generally, this means that the layout is there in big blocks, but most imagery and color are missing.

You should also make sure to include final copy (writing) in your wireframes so that you make sure the layout and user flow will work well with the content.

 - [Wireframe inspiration](https://dribbble.com/search?q=wireframes)

### Wireframing tools

 - [Wireframe.cc](https://wireframe.cc/)
 - [UXPin](https://www.uxpin.com/)
 - [Balsamiq](https://balsamiq.com/products/)
 
## Copywriting

- [10 Tips on Writing from David Ogilvy](https://signalvnoise.com/posts/3351-link-10-tips-on-writing-from-david-ogilvy)
- [Writing Decisions: Saving space without losing meaning](https://signalvnoise.com/posts/1539-writing-decisions-saving-space-without-losing-meaning)', NULL, '-L-3X5qkrcs1s-On6-SI', 'Create a homepage and internal page wireframe for your space company', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (238, 'html-final-website', 'Final Website', 4, '## Final Website Details

### Overview

The final module will involve building out a four (4) page website based on the pre-production work you''ve already done in the _design process_ modules. Make sure to reference prior modules to make sure you''re building internal pages correctly (folder + `index.html` file) and that your HTML pages are valid and working correctly.


### Notes on Requirements

1. All HTML And CSS must be valid and checked with Atom''s built in linting or the W3C validator.
2. You may use Bootstrap for base CSS and layout--if you go that route, you must provide at least 10 additional CSS rules of your own.
3. The final website must be hosted on Surge.
4. Make sure you carefully review all the requirements in the project section of this module.', NULL, '-L-JDffzP-TlFUbmMc9J', 'Final Website', 'Surge', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (239, 'html-editor-and-basic-elements', 'Build a simple webpage using basic HTML elements', 1, '## Installing a code editor

As a human (presumably), you''re super smart. If we make a typo in this sentnce, you''ll keep on reading and maybe not even notice it. Computers though - they hate typos. Sometimes they do all right, but the wrong typo can break everything.

Fortunately, just like there are tools to check spelling and grammar in programs like Microsoft Word, *code editors* have similar tricks to help you write code. In this lesson, we''ll install a code editor called *Visual Studio Code*, or *VS Code* for short, and learn how to make it do as much of your work as possible.

Head over to [code.visualstudio.com](https://code.visualstudio.com/). Now click on the _Download_ button. 

When you''re done installing,

1. start the project for this lesson,
2. clone the GitHub repo to your projects folder,
3. then open up VS Code.

The first thing you''ll probably notice is that unlike most programs, VS Code is full of dark backgrounds with light-colored text.

![VS Code at startup](https://i.imgur.com/okCZmGb.png)

When you''re spending a lot of time squinting at code, you''ll appreciate this, as the dark backgrounds are easier on the eyes!

You''ll also notice a lot of different buttons, but don''t worry about them for now. Just click on `File` → `Open` and open the directory for the project you just cloned.

![Opening a folder in VS Code](https://i.imgur.com/rnfcQk5.png)

Once that''s done, you should see a new sidebar on the left with the name of the directory at the top, similar to:

![Folder with empty sidebar in VS Code](https://i.imgur.com/wah1cQe.png)

Once again, we''re going to create an `index.html` file, but this time in VS Code. Right-click in the space below your project directory, click on `New File`, type `index.html` into the box that appears, then press Enter.

![Creating a new file in VS Code](https://i.imgur.com/DebAvgO.png)

![Naming a new file in VS Code](https://i.imgur.com/tO1SOaB.png)

Excellent! Now, it''s time to create a _slightly_ more sophisticated website.

## The basics of HTML (`strong`, `em`)

Let''s add a little pizzazz to our `index.html` file:

``` {.html}
This is a <strong>great</strong> website!
```

~~~ {.note}
In VS Code, you may notice that the code isn''t just a single color. This is a feature called *syntax highlighting*. Since every character is important, these different colors help you more easily skim code and notice when something is out of place.

*Pay attention to these colors!* If you make a typo and remove a vital character, you''ll often notice they change drastically:

``` {.html}
This is a <strong great</strong> website!
```

This can be a great hint that something is wrong. 
~~~

Now save your changes by choosing `Save` from the `File` menu and try opening the file in your browser. In VS Code, you can right-click on the file, then on:

* `Reveal in Finder` (macOS)
* `Reveal in Explorer` (Windows)
* `Open Containing Folder` (Ubuntu)

Then just as in the previous lesson, double click on the file to open it in your browser.

You should now see your website, with the word `great` bolded:

~~~ {.result}
This is a <strong>great</strong> website!
~~~

That''s because the `strong` element indicates text of _strong importance_, which means by default in most browsers, it''s bolded. Notice that `<strong>` and `</strong>` _do not_ appear on the page -- they simply affect whatever''s in between them.

You may also notice a tiny difference between the first and second `strong`:

``` {.html}
<strong>
  great
</strong>
```

Do you see it? Each of these two parts is called a *tag* and:

* the 1st one -- the *starting* tag -- starts with `<`
* the 2nd one -- the *closing* or *end* tag  -- starts with `</`

Together, they form an *element* and anything in between the two is the *content* of that element.

Another element that goes very nicely with `strong` is `em`:

``` {.html}
Those kitties are <em>sooo</em> cute.
```

It''s very similar to `strong`, indicating that the content should be _emphasized_, adding italics by default in most browsers:

~~~ {.result}
Those kitties are <em>sooo</em> cute.
~~~

There are many different HTML elements and we won''t teach you all of them in this lesson, but in the following pages, we''ll walk through some very common ones and teach you a little bit more about the nuances along the way.

## Inline vs block elements (`p`, `h1`-`h6`)

Now if you''ve done some experimenting, you may have noticed that:

``` {.html}
Multiple
lines
are
collapsed
into
one
line
in
HTML.
```
~~~ {.result}
Multiple
lines
are
collapsed
into
one
line
in
HTML.
~~~

``` {.html}
And even
<strong>
  strong
</strong>
or
<em>
  em
</em>
elements are collapsed.
```
~~~ {.result}
And even
<strong>
  strong
</strong>
or
<em>
  em
</em>
elements are collapsed.
~~~

So how do you actually create multiple lines, for example to separate paragraphs? That''s where *block* elements come in. One of the most common block elements is the *paragraph* element (`p`):

``` {.html}
<p>This is a paragraph.</p>
<p>Here''s another paragraph.</p>
```
~~~ {.result}
<p>This is a paragraph.</p>
<p>Here''s another paragraph.</p>
~~~

This works because block elements appear on top of each other, as opposed to inline elements (and text), which appear side-by-side.

The 6 *heading* elements are also very common. Ranging from highest to lowest importance, they include:

``` {.html}
<h1>Hello</h1>
<h2>Hello</h2>
<h3>Hello</h3>
<h4>Hello</h4>
<h5>Hello</h5>
<h6>Hello</h6>
```
~~~ {.result.headings-example}
<h1>Hello</h1>
<div class="h2">Hello</div>
<h3>Hello</h3>
<h4>Hello</h4>
<h5>Hello</h5>
<h6>Hello</h6>
~~~

## Nested elements (`ol`, `ul`, `li`)

Elements can also go inside of each other. For example:

``` {.html}
<h4>Pronouncing rhinoceros</h4>
<p>
  In the word <strong>rhinoceros</strong>, 
  the emphasis should be on the second syllable, like   
  <strong>
    rhi<em>no</em>ceros
  </strong>.
</p>
```
~~~ {.result}
<div class="flex-col">
<h4>Pronouncing rhinoceros</h4>
<p>
  In the word <strong>rhinoceros</strong>, 
  the emphasis should be on the second syllable, like   
  <strong>rhi<em>no</em>ceros</strong>.
</p>
</div>
~~~

There are a bunch of elements inside the `p` element -- and even within that, there''s an `em` inside of a `strong`! This is called *nesting* elements, similar to how Matryoshka dolls can be nested inside of each other: 

![Matryoshka dolls](https://i.imgur.com/OU0uYm5.jpg)

Some elements are _always_ nested inside of other elements. One such example is the *list item* element (`li`). It can be either inside of an *ordered list* (`ol`):

``` {.html}
<ol>
  <li>ordered</li>
  <li>list</li>
  <li>items</li>
</ol>
```
~~~ {.result}
<ol>
  <li>ordered</li>
  <li>list</li>
  <li>items</li>
</ol>
~~~

Or an *_un_ordered list* (`ul`):

``` {.html}
<ul>
  <li>unordered</li>
  <li>list</li>
  <li>items</li>
</ul>
```
~~~ {.result}
<ul>
  <li>unordered</li>
  <li>list</li>
  <li>items</li>
</ul>
~~~

But it must always be in one of those two. Conversely, `ul` and `ol` elements may _only_ contain `li` elements, though those `li` elements may include any other elements.

## Elements with attributes (`a`)

Elements can also include *attributes* in the opening tag. Attributes attach extra information to the element that can change its behavior. One example of an element that will almost always have attributes is the *anchor* element (`a`), which is used for links:

``` {.html}
Here''s a link to
<a href="https://google.com/" target="_blank">Google</a>.
```
~~~ {.result}
Here''s a link to
<a href="https://google.com/" target="_blank">Google</a>.
~~~

There are two attributes here: `href` and `target`, with *values* of `https://google.com/` and `_blank`, respectively. 

The name `href` might sound pretty strange, but you might be able to guess what it does. It tells the browser where to send the user if they click on the link. It stands for _hyperlink reference_.

By default, links open in the same tab, but with `target="_blank"`, the link will open in a new tab.

~~~ {.note}
This might be a lot of new vocabulary for you! The most important words to understand right now are _element_, _tag_, and _attribute_. You''ll see them a lot in future lessons. Here''s a little review.

An *element* is a unit of HTML that will show up on the page. Some elements you''ve learned about so far are `strong` (bold text), `p` (paragraph), `a` (anchor), and `ol` (ordered list). 

A *tag* is the beginning or ending of the element in the code. It will always start with `<` and end with `>`. An example is `</a>` (that''s a *closing* or *end* tag, which you can tell because it includes `/`). 

An *attribute* is extra information about the element. Attributes are always part of an element; they can never stand alone. You will always find attributes in the opening tag of an element. Some examples are `href`, `class`, `id`, and `alt`. [Here''s a complete list of HTML attributes, if you''re curious!](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes)

![Anatomy of an element](https://i.imgur.com/8Gbry1P.png)
~~~

## Self-closing elements (`img`)

There are also elements that don''t have a closing tag, because they can never have content. One example is the *image* element:

``` {.html}
<img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
```
~~~ {.result}
<img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
~~~

The `img` element also has two _required_ attributes: 

* `src`: the source URL for the image
* `alt`: what text should appear if the image can''t load for some reason

If the browser couldn''t download the image above, you''d see this instead:

~~~ {.result}
<img src="_" alt="Cat picture">
~~~

### Making images clickable

It''s also common practice to wrap an `img` in an `a`, so that users can click on the image to be taken to a full-sized version:

``` {.html}
<a href="https://i.imgur.com/hmcq8n6.jpg" target="_blank">
  <img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
</a>
```
~~~ {.result}
<a href="https://i.imgur.com/hmcq8n6.jpg" target="_blank">
  <img src="https://i.imgur.com/hmcq8n6.jpg" alt="Cat picture">
</a>
~~~

The image might not look any different, but if you put your mouse over it, the cursor should change. If you click on it, you''ll now be able to count that kitty''s whiskers.

### Finding images for your websites

If you have images on your computer that you want to share online, you can actually place them in the same directory as your `index.html` file, then use the filename as the value of the `src` attribute:

``` {.html}
<img src="fluffles-the-turtle.jpg" alt="Fluffles is super pumped for the rave he''s been planning">
```

If you''d like to use an image you find online, it can be slightly more complicated. You have to make sure you:

1. have *legal permission* to use the image
2. are *hosting* the image yourself or from another consenting source
3. have provided *attribution* for the image, if necessary

To make sure you have legal permission to use an image, you have two options: 

1. Contact the owner to confirm your proposed usage is appropriate. You might need to pay to use the image. 
2. Only use images that you know are in the public domain or royalty-free. 

We recommend the 2nd option. It''s easier. Some great sources for images like this include:

* [Pixabay](https://pixabay.com/)
* [Wikimedia Commons](https://commons.wikimedia.org/w/index.php?search=&title=Special%3ASearch&go=Go&uselang=en)

Once you find an image you like, you''ll have to download it. You can do this by right-clicking on it in your web browser, then clicking on `Save Image As...` (or similar, depending on the browser you''re using). Give it a descriptive name and save it in your project directory. Now you can use it in your webpage, just as described earlier.

If the page with the image mentions that its license requires *attribution*, that means you have to include where the image came from. Sometimes, attribution just means link back to the source and sometimes it''s preferred to place a note right below the image. If it''s not specified in the license, we prefer the latter.

## What _is_ HTML? What can it do?

You''ve now created two files ending with `.html` and have heard that they''re a foundation of web development, but... what exactly _is_ *HTML*? Well, it''s short for *HyperText Markup Language*, but that still doesn''t tell us very much, so let''s take a step back and look at it in context. 

It''s actaully just one of three languages that web browsers speak. Each of these languages has a specific job (though there is some overlap) and HTML''s job is to help you define the *content* and *structure* of the page. In other words, what will appear and how will it be organized?

That''s a big responsibility, but there''s a lot that''s not covered there.

### What HTML _can''t_ do

Generally speaking, it''s not possible to control the *design* of the page purely with HTML (i.e. _how_ it looks). For example, if you want a 2-column layout, links to be green, paragraphs to be farther apart, or you want to use a different font for headings, you''ll need another language called *CSS*.

It''s also not generally possible to control *complex interactions* just with HTML (at least not without refreshing the page). Examples include like/retweet buttons, interactive charts, information that updates automatically -- all of these require another language called *JavaScript*.

You''ll learn more about these other languages soon, but for now...

![Patience, you must have](https://i.imgur.com/wj51FJk.jpg)

### Working on the project

The website you''ll build for this lesson will have well-structured information, but it won''t be pretty or have any cool animations. To give you a better idea of what to expect, removing any CSS or JavaScript from an older version of this lesson looked like this:

![This lesson with plain HTML](https://i.imgur.com/zirk84K.png)

It''s still pretty readable, just a little plain-looking. That means in our project, we''ll have to compensate by making the content funny and charming.

![Fly, be free](https://i.imgur.com/RN26BYO.jpg)

Cat pictures help. We hope. 😅
', NULL, '-LLA0SRo9pohgRDY6_8x', 'Build a résumé for a fictional character, applying for a fake (and ideally ridiculous) job', 'GitHub Pages', 0);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (5933, 'misc-markdown', 'Document all the things with Markdown', 3, '## Markdown is code for notes

HTML is alright at organizing the content on a website and as far as accessing the Internet with a web browser goes, it''s really the only way to publish information.

Writing HTML for the web can be cumbersome and awkward, though! All those angle brackets, closing tags, and attributes... it''s no wonder so many websites provide a rich text editor to help you format your content!

Fortunately, there''s another file format, or _syntax_, that we can use to type more naturally, is easy to read, and can even be used to produce HTML, PDFs, Word Docs, and more. That syntax is called *Markdown*.

![Markdown logo](https://i.imgur.com/lh8l4z6.png)

### Where is it used

If you know the special notation to format text in Discord, Slack, or GitHub then congratulations, you''ve already used Markdown.

Believe it or not, Markdown has existed since 2004, but its widespread adoption -- especially in software development -- didn''t pick up until the early 2010s.

Nowadays, you can find Markdown all over the place including StackExchange, Reddit, Slack, and Discord. It''s also popular for professional writing on the web and can be used on WordPress, Dropbox Paper, Leanpub, and Notion. Even this lesson was written in Markdown!

But the main place programmers like us will see Markdown is on GitHub.

### A quick glance at Markdown

So, so, wait, what does it actually _mean_ that Markdown is easier to read and write than HTML? Or, what does Markdown actually look like?

Let''s consider some HTML first:

``` {.html}
<h1>Heading</h1>

<p>hello world</p>
```

There are more HTML here than actual words! Bleh, I say. Bleh! 🤮

Let''s see the Markdown way of writing this:

``` {.md}
# Heading

hello world
```

Much simpler, yes? There''s only one special character here: a `#` to denote the heading. And that''s Markdown, folks. A really light way of representing information in a structured way.

Since Markdown can be translated into HTML, the results of both the HTML and Markdown examples will be the same:

~~~ {.result}
<h1>Heading</h1>

<p>hello world</p>
~~~

Pretty slick, right?

## The HTML we know, but with Markdown

You can use Markdown to recreate all of the elements introduced in the previous lesson _and more_.

Here''s a summary of how to write Markdown to reproduce these elements and examples of what they may look like when rendered.

### Paragraphs

When writing, it often makes sense to break sentences up into small paragraphs. This makes text easier to read and easier to search, which is really useful for notes and documentation.

To make a paragraph using Markdown, put blank lines before and after one or more lines of text. All of the lines of text next to each other will be gathered up and made into a single paragraph.

Here''s an example of two paragraphs. The first is one long line of text. The second is separated into four sentence fragments.

``` {.md}
Text separated by a blank line will appear as separate paragraphs.

Two or more lines of text that
do not have a blank line between
them will be combined into one
paragraph.
```

The results are two separate paragraphs, each with one long sentence:

~~~ {.result}
Text separated by a blank line will appear as separate paragraphs.

Two or more lines of text that
do not have a blank line between
them will be combined into one
paragraph.
~~~

### Emphasized and strong text

There are two common ways to make words stand out in Markdown: emphasized text and strong text. So what''s the difference?

Use _emphasized text_ when you want to add verbal stress to certain words. It is often — but not always! — printed with _italic lettering_.

*Strong text* has a sense of urgency, importance, or seriousness to it. It is often — but not always! — printed with *bold lettering*.

...It''s okay to be confused. Just pick the one that feels right and go with it. 😉

When you''re ready to make some words stand out in Markdown, here''s how you do it:

``` {.md}
Use _one underscore_ or *one asterisk* before and after
text to emphasize it.

Use __two underscores__ or **two asterisks** before and
after text to make it strong.
```

The results will look like this:

~~~ {.result}
Use <em>one underscore</em> or <em>one asterisk</em> before and after text to emphasize it.

Use <strong>two underscores</strong> or <strong>two asterisks</strong> before and after text to make it strong.
~~~

### Headings

Headings give titles to our content and often stand out from the regular flow of text by being big and bold so that they''re easy to find.

HTML allows six levels of headings (`h1`, `h2`, `h3`, etc.) and there are some guidelines about choosing the appropriate level of heading as well:

1. Use one (and only one) `h1` to title your document
2. The title of a subsection of content should have one higher level than the last heading used

To create a heading with Markdown, start a line with one, two, three, four, five, or six `#` characters. The resulting HTML will be a corresponding heading element (`h1`, `h2`, `h3`, etc.). Some Markdown renderers will even create hidden anchors so you can link to specific parts of your page.

Each heading will likely appear slightly different when rendered. Here are examples of all six:

``` {.md}
# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6
```

And here''s how they might look when rendered on a website:

~~~ {.result}
<p class="text-5xl">Heading 1</p>
<p class="text-4xl">Heading 2</p>
<p class="text-3xl">Heading 3</p>
<p class="text-2xl">Heading 4</p>
<p class="text-xl">Heading 5</p>
<p class="text-lg">Heading 6</p>
~~~

### Lists

Markdown, like HTML, supports two types of lists: ordered and unordered.

To make an ordered list, put a number followed by a period at the beginning of a line of text. Like this:

``` {.md}
1. Item one
2. Item two
3. Item three
5. Item four
```

And they''ll appear numbered, like this:

~~~ {.result}
1. Item one
2. Item two
3. Item three
5. Item four
~~~

Notice how the `5.` in the Markdown was turned into a `4.` in the results?

In Markdown you can use _any_ number with a period to make an ordered list with the correct numbering. This is a handy shortcut that makes it easy to reorder items without keeping track of their numbers!

To make an unordered (bulleted) list, start a line with a `*` or `-` character followed by a space:

``` {.md}
* This is a list item
* Another list item
* And yet another

- This is a list item
- Another list item
- And yet another
```

They both look the same when rendered:

~~~ {.result}
<ul>
<li>This is a list item</li>
<li>Another list item</li>
<li>And yet another</li>
</ul>

<p>
<ul>
<li>This is a list item</li>
<li>Another list item</li>
<li>And yet another</li>
</ul>
</p>
~~~

You can also put lists inside of other lists by adding two spaces before the list item(s) that you want to indent and nest:

``` {.md}
* This is a list item
  - Point A
  - Point B
* Another list item
  1. Item one
  2. Item two
  3. Item three
* Something else
```

The nested list will usually appear indented, like this:

~~~ {.result}
<ul>
<li>
  This is a list item
  <ul>
  <li>Point A</li>
  <li>Point B</li>
  </ul>
</li>
<li>
  Another list item
  <ol>
  <li>Item one</li>
  <li>Item two</li>
  <li>Item three</li>
  </ol>
</li>
<li>Something else</li>
</ul>
~~~

### Links

Links have two parts: a URL and the text that will be shown in its place. To make a link in Markdown, wrap the text in square brackets `[]`, immediately followed by the URL inside parantheses `()`:

``` {.md}
Welcome... to [ZomboCom](https://html5zombo.com).
```

The beautifully rendered link will look something like this:

~~~ {.result}
Welcome... to [ZomboCom](https://html5zombo.com).
~~~

### Images

Creating an image in Markdown is similar to making a link. Start with an exclamation mark `!`, then provide some text to describe the image in square brackets `[]`, and finish with the URL to the image inside parentheses `()`:

``` {.md}
![Dog saying ''My specialty is roofing''](https://i.imgur.com/vUY1b3H.png)
```

Here''s how that image will appear:

~~~ {.result}
![Dog saying ''My specialty is roofing''](https://i.imgur.com/vUY1b3H.png)
~~~

### But wait, there''s more

We''ve covered enough Markdown to take good notes or write a blog post, but there''s more to Markdown than these basic elements, like tables, block quotes, definitions, footnotes, and more.

If you want to see what else Markdown has to offer, take a look at the cheat sheet on [The Markdown Guide](https://www.markdownguide.org/cheat-sheet/).

~~~ {.warning}
### A Markdown "gotcha"

There''s one caveat to keep in mind when using Markdown and reading the rest of this lesson:

_Rendered Markdown will sometimes look different in different programs._

For example, Slack will render `*some text*` as *some text*, but in GitHub that same Markdown will appear as _some text_.

Just keep writing Markdown. Eventually your brain will adjust to these subtle differences. 🙃
~~~

## GitHub-flavored Markdown

Markdown has become one of the most popular ways for programmers to share information about the code that they write on the Internet, and not just documentation, either!

Websites, software licenses, bug reports, and even whole conversations (like in a code review) can be written using Markdown. Much of Markdown''s pervasiveness can be attributed to popular code-hosting sites like GitHub.

Not only can you use Markdown pretty much anywhere on GitHub, you can also do things that you can''t do with plain Markdown, like make colorful syntax-highlighted code blocks and task lists.

These features are known as [GitHub-flavored Markdown](https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown), or GFM for short.

### Code blocks

Did you read that Markdown Guide? If so, you may have noticed that you can indent text four spaces to turn it in a code block.

But.

The code blocks from plain Markdown don''t add colorful syntax highlighting based on the programming language. And besides, no one wants to put four spaces before every line of code in a Markdown snippet!

GitHub-flavored markdown _does_ do this though, and it''s fantastic.

![Spongebob Squarepants saying "Please tell me more"](https://i.imgur.com/AyI4lDN.png)

Here''s how: start a line with three backticks (called a code fence) and an optional programming language, then write some code, and finish with a line of three more back-ticks. The backtick (`\``) can be found to the left of the `1` on your keyboard.

Here''s an example of a GitHub-flavored code fence:


``` {.md}
\``` javascript
function sayHello (name) {
  window.alert(''Hello, '' + name)
}
\```
```

GitHub will render your code in a code block with colorful syntax highlighting. The result will look like this:

![Syntax highlighted JavaScript code on GitHub](https://i.imgur.com/4KLmhbX.png)

That''s much easier to read that plain black text! 😍

There are hundreds of supported languages including `javascript` (or simply `js`), `css`, `html`, `ejs`, `json`, `sql`,  and `sh`. The full list is in a [Yaml file on GitHub](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml).

### Inline code

It may make sense to put a small code snippet in the middle of a sentence without interrupting the flow or adding colors. There''s a way to do this, too.

Surround the code or text with single backtick characters (`\``), like so:

``` {.md}
Visit `localhost:8080` in your web browser.
```

The result is a regular sentence, but with the code snippet formatted using a monospace font and a different background color:

![Inline code snippet on GitHub](https://i.imgur.com/jls95lK.png)

Outside of GitHub, a rendered inline code snippet may look like this:

~~~ {.result}
Visit `localhost:8080` in your web browser.
~~~

Okay, time to fess up. This _technically_ isn''t GitHub-flavored Markdown, but there isn''t a more appropriate place in the lesson to introduce inline code snippets, so there you have it.

### Task lists

You''ve already completed a project, right? When you submitted the project, did you notice that the GitHub issue was created with a list of all the project criteria formatted as a list of checkboxes?

That''s a task list, and they''re useful for any kind of checklist you may need on GitHub.

To make a task list, use the syntax to make an unordered list, starting each item in the list with either `[ ]` or `[x]` depending on whether the task needs doing or is done.

Here''s an example:

``` {.md}
- [x] Create a time machine
- [x] Go back in time
- [ ] ???
```

The result will look something like this on GitHub:

![rendered task list on GitHub](https://i.imgur.com/aJ9arJW.png)

If you make a task list on GitHub and click on one of the checkboxes, GitHub will automatically edit the Markdown to reflect toggling the checkbox. You can also click and drag the tasks to reorder them. How cool is that! 😎

### Reference Issues and People

GitHub offers simple ways to reference an issue, person, or team on their website, too.

Why would you want to do this? If someone creates a bug (as an issue), and you submit a fix for that issue, it''s helpful to provide a link to what you''re fixing. It''s also helpful to mention people interested in or affected by your change.

To make a link to a GitHub issue, type `#` and then the number of the issue. Don''t know the issue number? If you''re connected to the Internet, GitHub will show you a list of issues to choose from as soon as you type the `#` character.

Teams and people can be referenced by typing an `@` symbol followed by the user or team name. GitHub will also provide you a list of suggested names after you type the `@`. Like other social websites, using `@` to reference a person is called a _mention_.

Here are examples of an issue reference and a mention:

``` {.md}
These changes resolve #1.

@egillespie, can you offer some feedback?
```

When GitHub turns these references into links, they''ll look like this:

![rendered issue reference and user mention](https://i.imgur.com/tqyiZtW.png)

Even though they look different, both `#1` and `@egillespie` are links.

If you [phrase an issue reference just right](https://help.github.com/en/enterprise/2.16/user/github/managing-your-work-on-github/closing-issues-using-keywords#about-issue-references), GitHub may close the issue automatically if your code is accepted and merged.

Oh, and when you mention a user on GitHub, they''ll receive a notification. So be careful with that. 😉

### There''s more GFM, too!

This page has introduced some fairly common GitHub-flavored Markdown, but like regular Markdown, there''s even more not covered here.

Read [GitHub''s Mastering Markdown Guide](https://guides.github.com/features/mastering-markdown/#GitHub-flavored-markdown) to learn how to make tables, strikethrough text, reference commits, and more.

There is also a printable [GitHub-flavored Markdown Cheat Sheet PDF](https://guides.github.com/pdfs/markdown-cheatsheet-online.pdf).

## Documenting a code repository

Markdown is a really popular way to document software projects. In fact, it''s _the_ default way to make documentation on GitHub. Just try to add a new repository and you''ll see this:

!["Initialize this repository with a README" checkbox on GitHub](https://i.imgur.com/WQ5jlwQ.png)

If you check the box next to "Initialize this repository with a README" then GitHub will automatically add a file named `README.md` to your new repository and render it for anyone who can see your project:

![Sample rendering of GitHub''s generated README.md file](https://i.imgur.com/5aowvmW.png)

You can also add your own file named `README.md` to any GitHub project and the rendered Markdown will be shown to anyone who can access your repository.

GitHub will actually render _any_ file in your repository with the `.md` extension. So when your thousand-page fanfic starts taking too long to download, you can split it up into many pages and link them together.

![Kermit the Frog "Just sayin''"](https://i.imgur.com/r4WrFw5.png)

### What goes in a README?

GitHub recommends that you put the following information in your `README.md` file:

* What the project does
* Why the project is useful
* How users can get started with the project
* Where users can get help with your project
* Who maintains and contributes to the project

If you''re working in a big project, these details can get really big! Just remember that you can split these up into multiple files if you want or need to.

### Writing Markdown in VS Code

VS Code also has some nice features to help write documentation in Markdown. Take a look at this screenshot:

![Editing Markdown in VS Code with a Preview](https://i.imgur.com/IXSW1VV.png)

The left half shows VS Code''s built-in Markdown editor. It adds syntax highlighting to your Markdown to help you see typos, headings, and more.

The right half shows a preview of the rendered Markdown. If you make changes to the Markdown file, the preview will update automatically in real-time!

To open the preview, click the "Open Preview to the Side" icon in the top right of VS Code. You can also press `Cmd`+`K` `V` (Mac) or `Ctrl`+`K` `V` (Windows/Linux).

## Making a website with Markdown

Now that you''ve seen how to write Markdown that can be used to produce HTML, the natural conclusion is to make a website using Markdown instead of HTML.

With only a few small additions, your Markdown can be transformed into a beautiful website like this:

![A sample GitHub Pages site with many custom styles](https://i.imgur.com/feVKnGl.png)

Fancy, right? Let''s learn how to make this!

### Step 1: Pick a theme

In order to make a full-blown website with Markdown, we''re going to use GitHub Pages. When an HTML file is pushed to the `gh-pages` branch of a project on GitHub, the HTML will automatically be hosted on the web.

If you provide a configuration file though, you can tell GitHub Pages to do a lot more, like apply a theme to your Markdown files and host those on the web, too.

Start by creating a file named `_config.yml` in the root of your GitHub project folder and add the following line of text to it:

``` {#_config.yml}
theme: jekyll-theme-architect
```

This will tell GitHub Pages to apply the Architect theme to the content in our repository and, more importantly, convert Markdown files to pages on our GitHub Pages hosted site.

Where did the value `jekyll-theme-architect` come from? GitHub Pages supports [_a lot_ of named themes](https://pages.github.com/themes/). You can even make your own theme if you''re really ambitious!

Here''s a list of the built-in themes along with their `_config.yml` values and stylized thumbnails:

------------------------------------------
 Name | Configuration value | Thumbnail
------------------------------------------
 Architect  | `jekyll-theme-architect` | ![Architect theme](https://i.imgur.com/eRLlvGS.png)
 Cayman  | `jekyll-theme-cayman` | ![Cayman theme](https://i.imgur.com/TOCniYX.png)
 Dinky  | `jekyll-theme-dinky` | ![Dinky theme](https://i.imgur.com/lxu6tsg.png)
 Hacker  | `jekyll-theme-hacker` | ![Hacker theme](https://i.imgur.com/wNffnKx.png)
 Leap day  | `jekyll-theme-leap-day` | ![Leap day theme](https://i.imgur.com/stpwZEe.png)
 Merlot  | `jekyll-theme-merlot` | ![Merlot theme](https://i.imgur.com/Sc9cYjz.png)
 Midnight  | `jekyll-theme-midnight` | ![Midnight theme](https://i.imgur.com/6GGVZVS.png)
 Minima  | `minima` | ![Minima theme](https://i.imgur.com/lS6WENL.png)
 Minimal  | `jekyll-theme-minimal` | ![Minimal theme](https://i.imgur.com/7QO8AkC.png)
 Modernist  | `jekyll-theme-modernist` | ![Modernist theme](https://i.imgur.com/JpAeg2q.png)
 Slate  | `jekyll-theme-slate` | ![Slate theme](https://i.imgur.com/8TI1Jgm.png)
 Tactile  | `jekyll-theme-tactile` | ![Tactile theme](https://i.imgur.com/m5U7bMc.png)
 Time machine  | `jekyll-theme-time-machine` | ![Time machine theme](https://i.imgur.com/y3HyARn.png)
------------------------------------------

That''s... that''s a lot of themes. And does it bug anyone else that `minima` is the _only one_ that doesn''t start with `jekyll-theme-`?  😅

### Step 2: Front Matter

Almost there! But before GitHub Pages can turn a Markdown file into a webpage, there are a few details it needs:

* The layout or type of page
* The title of your page
* The path or route for the page

Markdown doesn''t have a way to provide this information, so something extra called _*front matter*_ is needed.

Front matter is a special section of text at the top of a file that starts and ends with lines containing three hyphens (`---`) and additional information about the file in between.

Here''s a sample Markdown file with front matter at the top:

``` {#index.md}
---
title: "My Next Big Project"
permalink: /
layout: default
---

# My Next Big Project

This site is under construction.
```

In this example, the Markdown file is named `index.md` to resemble how naming the main HTML file `index.html`. The file could just as easily have been named `home.md` or `main.md`, but following conventions makes it easier for others to understand.

The `title` property is "My Next Big Project". Most themes will place this value within the `<title>` tag of the generated HTML so it can be seen in the browser window or tab.

To give a page a unique path on the generated website, it must be given a unique `permalink` value. In the example, the value `/` is used so that this page will be the first page (the homepage) someone sees when they visit the website.

The `layout` property decides how your page will look in the browser. All of the built-in themes provide a layout named `default` so it''s a safe choice to start with. Some themes do provide additional layouts, though. You can find them in the theme''s documentation or source code.

### Deploy, deploy!

The last step is a familiar one: push our changes to GitHub and the `gh-pages` branch:

``` {.sh}
git push origin main:gh-pages
```

Once this is done, wait a few minutes — seriously, it can take several minutes for GitHub Pages to generate and host the site — and we''ll see a beautifully rendered website from only a few lines of Markdown!

![My Next Big Project on GitHub Pages](https://i.imgur.com/qXisBy1.png)', NULL, NULL, 'Write a blog article about a computer skill you recently learned', 'GitHub Pages', 27);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (223, 'js-firebase-intro', 'Use Firestore to share data with others', 2, '## Data for all!

Remember when we made a website that could remember jokes and can tell them back to you? 🤖

As nice as that project was, it had a big limitation: all of the jokes were saved on _your_ computer and _only_ on your computer. If you added a joke and opened the page on another computer, your joke wouldn''t show up!

That''s because we used `localStorage` to save our information and `localStorage` literally stores data locally. Locally, as in no one else can use it. If we want other people to see our jokes, we need to store that data on a remote computer where anyone can access it.

Software that lets us organize and store data so it''s accessible from many locations is a *database*.

Nowadays there are lots of different kinds of databases. Some of them store data in tables with rows and columns. Some databases let you put data in files and organize information however you want. And others -- like the one we''re learning today -- let you store data as JSON.

### CRUD

No matter which type of database we choose, there are four basic ways to interact with data in a database:

* *Create* - add data to a database
* *Read* - retrieve existing or recently changed data
* *Update* - change existing data
* *Delete* - remove existing data

These terms are worth remembering and if we combine the first letter from each one we get a mnemonic that makes remembering easy: *CRUD*.

Despite the unpleasant connotation of the word _crud_, databases usually make working with data quite pleasant. 🙃

### Data modeling

Something else that we need to do regardless of which type of database we use is to model our data.

![Not this kind of modeling](http://i.imgur.com/F5NXQvU.png)

Uh, no. Different kind of modeling.

We''re talking about *data modeling*, which means deciding how to organize -- or structure -- all of the information you want to put in a database.

In our joke project, we were given a data model:

``` {.js}
const jokes = {
  ''the horse'': {
    setup: ''A horse walks into the bar. The bartender asks...'',
    punchline: ''Why the long face?''
  },
  ''Orion\\''s pants'': {
    setup: ''How does Orion keep his pants up?'',
    punchline: ''With an asteroid belt.''
  }
}
```

`jokes` is a set of objects that each has an identifier (e.g. `''the horse''`). Each joke object contains one or more fields that have a key (e.g. `''punchline''`) and a value (e.g. `''Why the long face?''`).

Almost all databases use these concepts, but they may be named differently depending on the database. Let''s explore each of those concepts in a little more detail.

#### Records

In our project, a single joke is a *record*. Think of a record as a group of related pieces of information that are saved together in one place. The related pieces of information are known as *fields*. Fields can also be broken down into two parts: a key and a value.

The fields that make up a joke are the `''setup''` and the `''punchline''` (fields are often referred to by their key). The respective values for those keys are `''How does Orion keep his pants up?''` and `''With an asteroid belt.''`.

Each record is also identified by a unique key (e.g. `''the horse''` or `''Orion''s pants''`). No two records can have the same unique key.

#### Resources

A *resource* is a named collection of similar records. In our example, you can think of `jokes` as the name of a resource that will contain every joke we want to store.

Some databases use more specific terms than _resource_ to describe a collection of resources, but those specific terms -- such as _table_ -- also imply a specific structure. For our needs, we can stick with the generic term _resource_.

``` {.js}
// This whole object is a resource named ''jokes''
const jokes = {
  // This is an example of a record with two fields
  // ''the horse'' is the record''s unique key
  ''the horse'': {
    setup: ''A horse walks into the bar. The bartender asks...'',
    punchline: ''Why the long face?''
  },
  // This is also a record
  ''Orion\\''s pants'': {
    setup: ''How does Orion keep his pants up?'',
    punchline: ''With an asteroid belt.''
  }
}
```

## Introducing Firestore

Now that some basics about databases have been covered, let''s dig into a specific type of database: Firestore.

*Firestore* is a free database by Google that stores data in one giant JSON object. Google makes it easy to do all of the basic CRUD operations right from a web browser. They also have many advanced features that make it a good database for both beginners and experts.

The only requirement to start using Firestore is that you sign in at [firebase.google.com](https://firebase.google.com/) with a Google account.

~~~ {.warning}
Firestore is only one of many products available in Google''s Firebase suite of tools. It''s not even the only database you can use in Firebase.

*When you create a project in Firebase, make sure to use the Firestore database and not the Realtime database.*

The Realtime database is similar to Firestore but is older and lacks some of the features of Firestore. So confusing!
~~~

### Creating a project

After signing into [firebase.google.com](https://firebase.google.com/), use the navigation on the page to go to the Firebase Console. You''ll see a generic welcome page like this:

![Welcome to Firebase screen](https://i.imgur.com/1pHRtCj.png)

Before we can start using a Firestore database, we must first create a Firebase project. Click "Create a project" in the Firebase console to get started.

When asked for a project name, enter something short and descriptive. For our example project, let''s use `joke-a-tron-9000`.

Finish creating the project by agreeing to the terms of service and leave the default values alone. It may take a moment to create the project, but when it''s ready, go to the console for the new project. It''ll look something like this: 

![Firebase project console](https://i.imgur.com/WDzOqG8.png)

### Granting access to data

Before we can start using our new database, we have to tell Firebase _who_ has access to our data.

In the Firebase console, we can control who has access to our data by clicking on the _Authentication_ link under the _Build_ menu on the left side of the page.

When we click that link for the first time, we''ll see something like this:

![Firebase Authentication setup](https://i.imgur.com/rCz0Vll.png)

Firebase recommends that we set a sign-in method because in a brand new database, no one has access to the data unless they are signed into the Firebase console.

Click the _Get started_ button to see what our choices are.

![Firebase sign-in methods](https://i.imgur.com/r34hvRX.png)

Whoa, there are a lot of choices! If we wanted to, we could require someone to enter an email and password to access our jokes or even ask them to sign in using their Google, Facebook, Twitter, or GitHub account.

We don''t need anything fancy right now. Actually, we don''t even want to ask people to sign in; our jokes are going be available to everyone!

To allow access to anyone who visits our page, we need to enable _Anonymous_ access. First, let''s click on _Anonymous_ in the list of sign-in providers to see its options. You may have to scroll to find the _Anonymous_ provider.

Then we can use the toggle to enable anonymous access and click _Save_ to make the change permanent.

![Enable Anonymous access](https://i.imgur.com/BVgJiwe.png)

Excellent, now we can anonymously connect to our project!

### Creating a Firestore database

Before we can start using a Firestore database though, we also have to create the database.

This is even more straightforward than turning on anonymous access. Click on the _Cloud Firestore_ link under the _Build_ menu on the left side of the page:

![Cloud Firestore start page](https://i.imgur.com/X3xDFFs.png)

Click _Create Database_ on the Cloud Firestore page and a popup will appear that asks whether to create the database in production mode or test mode.

![Secure rules for Cloud Firestore](https://i.imgur.com/t30dwJZ.png)

Since this is our first time using Firestore and we''re more interested in playing around than creating a production-ready and secure database, let''s pick _*Start in test mode*_ and click _Next_.

~~~ {.warning}
Selecting the default _*Start in production mode*_ option will not allow anyone to read or write data unless special security rules are written to grant us access!

If you accidentally create your database in production mode, you can change the security rules to grant access to your data by clicking the _Rules_ tab on the _Cloud Firestore_ page. Then replace the rules in the text box with the ones shown below and click _Publish_ when you''re done. 😬

```
rules_version = ''2'';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true
    }
  }
}
```
~~~

The next step is to choose where in the world where your database will exist. The default value here is good enough for our needs so let''s click _Enable_ to create our database.

After a moment, Firebase will create the Firestore database and then show a dashboard where we can start creating data!🔥

## First contact

Databases store their data on remote computers, so we need to _connect_ to them before we can get or send information. Firebase makes connecting to their databases easy. Like, copy-paste easy.

Seriously, go to the _Project Overview_ page and click the `</>` link near the middle of the page:

![Project Overview page](https://i.imgur.com/yUU65zI.png)

A new page will appear that asks us to enter an app nickname and register our app. Let''s enter our project name, `joke-a-tron-9000`, then click _Register app_.

![Add Firebase to your web app](https://i.imgur.com/1YKPBaV.png)

After clicking the button, a text box will show an incomplete example of how to connect to the database. Leave this page open but *don''t copy the code* just yet.

![Add Firebase SDK](https://i.imgur.com/DrnBzvW.png)

Since our JavaScript code will be in a separate file from the HTML, we can''t copy the whole snippet and paste it into our HTML file. Instead, we''ll add the Firebase and Firestore scripts to the HTML and put the code from the last `script` element -- the one containing `firebaseConfig` -- in our JavaScript file.

As a reminder, here are the files in our project:

![Joke-a-tron file list](https://i.imgur.com/pqa8v3R.png)

First, let''s add the Firebase dependencies to our HTML. Copy the `script` tags from the code block below and paste them in `index.html`, just above the `<script src="app.js">` tag.

``` {.html}
<script src="https://www.gstatic.com/firebasejs/8.3.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/8.3.2/firebase-firestore.js"></script>
```

Make sure to include all of the `script` tags or we won''t be able to access the database. Firebase splits its dependencies up into small files so our page will load quickly and we only need to download the features we''ll actually use.

Next let''s copy the content of the last `<script>` tag from the Firebase setup code in our browser and paste it at the very top of `app.js`. Leave out the last line containing `firebase.analytics()`.

Feel free to fix all the linter errors introduced by that code snippet too. All that code was cool... ten years ago. 😉

~~~ {.warning}
Make sure to copy the code from your own Firebase project. If you use the code below, you''ll connect to the wrong database!

If you misplace the code snippet to connect to Firebase, you can find it by clicking on the gear icon next to _Project Overview_ in the Firebase console, the select _Project settings_ in the menu that appears. The code snippet will be at the bottom of the _General_ tab.
~~~

The top of `app.js` should now look like this:

``` {#app.js}
/* global firebase */

// Initialize Firebase
const firebaseConfig = {
  apiKey: ''AIzaSyCKj7jge9Vq__aZN9CEdsiWwgTYjW2GOTk'',
  authDomain: ''joke-a-tron-9000-99123.firebaseapp.com'',
  projectId: ''joke-a-tron-9000-99123'',
  storageBucket: ''joke-a-tron-9000-99123.appspot.com'',
  messagingSenderId: ''842807512042'',
  appId: ''1:842807512042:web:26a94beca6acd9970c4093'',
  measurementId: ''G-C4XDW252BW''
}

firebase.initializeApp(firebaseConfig)
```

The first line -- `/* global firebase */` -- tells our JavaScript linter that `firebase` is a global variable that is included elsewhere in our project. It makes the red squiggles under `firebase` go away.

The last line -- `firebase.initializeApp(firebaseConfig)` -- uses the Firebase `script` tags we added to `index.html` to initialize the app (a.k.a. connect to our Firebase project).

The `firebaseConfig` object contains all of the information that Firebase needs to know where the Firestore database is located and how to establish a connection.

~~~ {.note}
If you want to learn more about connecting to Firebase, read the documentation to [Add Firebase to your JavaScript project](https://firebase.google.com/docs/web/setup?from-the-cdn).
~~~

## Creating and changing data

Before we can access data in Firestore, there are two more important concepts to understand: *documents* and *collections*.

A Firestore document is similar to a JavaScript object: it contains a bunch of fields and their associated values. Firestore documents also have names, similar to how our jokes have keys to identify any one particular joke.

Firestore collections also have names, but instead of containing fields and values, Firestore collections contain documents.

These new ways to store data in Firestore resemble our `jokes` object in a lot of ways. Here''s a refresher of what `jokes` looks like:

``` {.js}
const jokes = {
  ''the horse'': {
    setup: ''A horse walks into the bar. The bartender asks...'',
    punchline: ''Why the long face?''
  },
  ''Orion\\''s pants'': {
    setup: ''How does Orion keep his pants up?'',
    punchline: ''With an asteroid belt.''
  }
}
```

In Firestore terms, `jokes` is the name of our collection. It contains two documents named `the horse` and `Orion''s pants`, and each of those documents contains two fields with associated values: `setup` and `punchline`.

In order to access collections and documents in Firestore, we must first get a reference to the database, like this:

``` {.js}
const db = firebase.firestore()
```

Make sure to call `firebase.firestore()` _after_ `firebase.initializeApp` when you add this to your JavaScript file.

Then we can access a collection like this:

``` {.js}
db.collection(''jokes'')
```

Of course, accessing a collection on its own doesn''t really do anything, so let''s explore some ways to create, change, and delete data in a collection.

### Creating a document

Since we''re using a brand new database, the first thing we want to do is add some data to it. There are two ways to create data using Firestore:

#### 1. Let Firestore generate document names

If we want Firestore to create document names for us, we can call `add` on a collection to create a new document:

``` {.js}
db.collection(''jokes'').add({
  setup: ''What do you call a bear with no teeth?'',
  punchline: ''A gummy bear!''
})
```

If we actually put this code in our `app.js` file and visit our site while it''s running in `live-server`, a new joke document will be created!

Let''s go to the Firebase console and click on the _Firestore_ link to see what our new (and very first!) collection and document look like:

![Firestore-generated document name](https://i.imgur.com/qE51YqE.png)

Hmm, sometimes it''s convenient for unique keys to be automatically generated, but we also want people to type in a joke name so we can show them the joke. Expecting someone to type in `Qz4ZQUa86G` `LIKSNR6ox2` isn''t user-friendly at all!

#### Generate your own unique keys

Our Joke-a-tron website asks for a joke key. It would be far more convenient if we could just use that. Lo and behold, Firestore _does_ let us do just that.

All we have to do is reference the document in our collection by name and then call `set` on the document:

``` {.js}
db.collection(''jokes'').doc(''gummy bear'').set({
  setup: ''What do you call a bear with no teeth?'',
  punchline: ''A gummy bear!''
})
```

If we run this code and go back to the Firebase console, our database will look like this:

![User-generated document name](https://i.imgur.com/zON9lvx.png)

That''s more like it!

### Updating a record

Updating information in Firebase is as easy as adding it. Just lookup the document you want to update and call `set` -- exactly like creating a document with a custom name.

Let''s say we wanted to add a bear emoji to the punchline of our `gummy bear` joke. We could update the whole document like this:

``` {.js}
db.collection(''jokes'').doc(''gummy bear'').set({
  setup: ''What do you call a bear with no teeth?'',
  punchline: ''A gummy bear! 🐻''
})
```

We don''t have to set all of the fields every time we want to change a document either. We can tell the `set` function to merge the fields we want to change with the fields that already exist:

``` {.js}
db.collection(''jokes'').doc(''gummy bear'').set({
  punchline: ''A gummy bear! 🐻''
}, { merge: true })
```

As expected, Firebase handles emojis like a boss:

![Punchline with a bear emoji](https://i.imgur.com/bw0NejR.png)

~~~ {.warning}
When you call `set` without the `merge: true` option, it will overwrite the entire document with the object supplied. That means if you want to update the punchline of our joke and do this:

``` {.js}
db.collection(''jokes'').doc(''gummy bear'').set({
  punchline: ''A gummy bear! 🐻''
})
```

You will actually _delete_ the setup of the joke because you didn''t provide a replacement!
~~~

### Deleting a record

Deleting a document from our database is pretty straightforward too. Instead of calling `set` on a document, we call `delete`.

``` {.js}
db.collection(''jokes'').doc(''gummy bear'').delete()
```

Goodbye, gummy bear joke. You were nothing but a bad news bear anyway. 🐻

![Document does not exist](https://i.imgur.com/kxcdjRw.png)

## Reading data

Remember how easy it was to create, update, and delete records in Firestore? Let''s call that "practice mode" for reading data.

It''s not so much that reading data is _hard_, there are just a lot of ways to do it. We also have to learn about *snapshots* before we can start reading data.

### Data snapshots

When we fetch data from Firestore, it''s returned to us in the form of a data snapshot. Data snapshots are special objects with helpful built-in properties and methods that we can use to access and interact with Firestore data.

![This might be Photoshopped](http://i.imgur.com/FfpkYLB.png)

Think of data snapshots like photos: they show us what something looked like at a single point in time. And much like Photoshopping a photograph won''t affect the real world, we can''t change anything in our database with a data snapshot.

When we get a snapshot from Firestore, here are some functions we can use to understand and use the associated data (if any).

#### `exists`

If we want to know whether a document really exists in our database, we can use the `exists` property on the snapshot.

If there is data associated with the snapshot, `exists` will be `true` and we can safely access the data. Otherwise it will be `false` and we should avoid reading data from the snapshot.

#### `data()`

When a snapshot contains actual data, `data()` will return a copy of that data in the form of a JavaScript object.

If the snapshot does not contain any data (i.e. when `exists()` returns `false`) then calling `data()` will return `undefined`.

So in the case where we have a data snapshot that contains our bear joke, calling `data()` would return this:

``` {.js}
{
  setup: ''What do you call a bear with no teeth?'',
  punchline: ''A gummy bear! 🐻''
}
```

#### `id`

`id` is a string property containing the name of the document. For example, if we have a snapshot that contains our bear joke, then `id` will be `''gummy bear''`.

Suppose we have a snapshot of our gummy bear joke named `snapshot`. We can use the properties and methods to print our joke like this:

``` {.js}
if (snapshot.exists) {
  const joke = snapshot.data()
  console.log(''Name:'', snapshot.id)
  console.log(''Setup:'', joke.setup)
  console.log(''Punchline:'', joke.punchline)
}
```

And the result will look like this:

``` {.output}
Name: gummy bear
Setup: What do you call a bear with no teeth?
Punchline: A gummy bear! 🐻
```

### Looking up a document one time

The most basic way to read a document in Firestore is to simply look it up by name and use it right away. To do this, we have to call two methods: `get` and `then`.

Let''s say we wanted to look up the `gummy bear` joke just once. The code would look like this:

``` {.js}
db.collection(''jokes'').doc(''gummy bear'')
  .get()
  .then(function (snapshot) {
    if (snapshot.exists) {
      const joke = snapshot.data()
      console.log(''Name:'', snapshot.id)
      console.log(''Setup:'', joke.setup)
      console.log(''Punchline:'', joke.punchline)
    } else {
      console.log(''Joke not found'')
    }
  })
```

The first thing this code does is lookup the document `''gummy bear''` in our `''jokes''` collection. Then we call `get()` to tell Firestore to send us a copy of the document. Finally, we use `then` to tell Firestore which function to call when it retrieves the data snapshot.

The result will look like this:

``` {.output}
Name: gummy bear
Setup: What do you call a bear with no teeth?
Punchline: A gummy bear! 🐻
```

### Looking up all documents in a collection one time

The `get` and `then` functions can be used on collections too! This is especially helpful when we want to show all the documents in a list like we do with our jokes.

The syntax is similar to looking up a document, but we''ll leave out the `.doc(''gummy bear'')` part and the snapshot that we get will contain all of the documents.

When we get the snapshot, we can use `forEach` and [other query snapshot functions](https://firebase.google.com/docs/reference/js/firebase.firestore.QuerySnapshot) to access the documents.

Here''s how we could add all of the Firestore jokes to our `jokes` object:

``` {.js}
db.collection(''jokes'')
  .get()
  .then(function (snapshot) {
    snapshot.forEach(function (doc) {
      jokes[doc.id] = doc.data()
    })
    updatePage()
})
```

When we call `forEach`, we provide a function that will be called once for each document in the collection.

### Knowing when data changes

This is where Firestore starts getting really cool. In fact, your mind may be blown in just a moment.

Most databases require you to ask for data any time you need it. This usually happens when someone visits a page or clicks a button. In those databases, if you always want to show your visitors the latest information, you have to ask the database for information over and over again.

Sound annoying? That''s because it is. 🙁

Luckily, Firestore does things differently. It lets us _watch_ a collection or document and will actually _send_ us data as soon as it changes. No more asking for the same data over and over!

All we have to do is tell Firestore what we want to watch (a collection or document) and give it a function to call when a change happens. This is done by calling the `onSnapshot` method, which works a lot like the `addEventListener` function we''re already familiar with.

#### Watching document changes

Suppose we want to know when someone changes our gummy bear joke (how dare they!). Here''s how we can use `onSnapshot` to handle those changes almost as soon as they happen:

``` {.js}
db.collection(''jokes'').doc(''gummy bear'')
  .onSnapshot(function (snapshot) {
    if (snapshot.exists) {
      const joke = snapshot.data()
      console.log(''Name:'', snapshot.id)
      console.log(''New setup:'', joke.setup)
      console.log(''New punchline:'', joke.punchline)
    } else {
      console.log(''Someone deleted the joke! 😭'')
    }
  })
```

If someone deletes, changes, or adds the joke named `''gummy bear''`, our function will be called with a new snapshot of the data.

We can use `exists` to find out if our joke was deleted and if it wasn''t, we know it was either added or updated.

#### Watching changes to a whole collection

We can also watch a whole collection and react to changes to _any_ document in it.

This is similar to watching a document with some additional steps to help us know whether a document was added, modified, or removed so out code can respond appropriately.

We will still use `onSnapshot` to handle changes to the collection, but our function will be given a snapshot that contains all of the latest document changes. To do this, we''ll call `snapshot.docChanges().forEach` to look at every changed document in the latest snapshot:

``` {.js}
db.collection(''jokes'')
  .onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      const joke = change.doc.data()
      if (change.type === ''added'') {
        jokes[change.doc.id] = joke
      } else if (change.type === ''modified'') {
        jokes[change.doc.id] = joke
      } else if (change.type === ''removed'') {
        delete jokes[change.doc.id]
      }
    })
    updatePage()
  })
```

In the example above, whenever a joke is added or modified, we apply the latest version of that document to our `jokes` object. If a joke is removed, we delete it from `jokes`.

After all of the changes made to `jokes`, we call `updatePage()` so the visitor can see the changes in the list and displayed joke parts of the page.

Another important feature of `onSnapshot` is that it will call our function once right away to give us the latest snapshot too. So if we use `onSnapshot` instead of `get`/`then` we will still be able to list all of the jokes on our website when the page loads.

### Putting it all together

Now that our code can respond to any changes in the Firestore database, all we need to do is write functions to add and forget jokes.

Here''s our new `rememberJoke` function:

``` {.js}
const rememberJoke = function () {
  const key = rememberJokeKey.value
  const setup = rememberJokeSetup.value
  const punchline = rememberJokePunchline.value
  if (key.trim().length > 0) {
    db.collection(''jokes'').doc(key).set({
      setup: setup,
      punchline: punchline
    })
  }
}
```

And here''s our new `forgetJoke` function:

``` {.js}
const forgetJoke = function () {
  const key = forgetJokeKey.value
  if (key.length > 0) {
    db.collection(''jokes'').doc(key).delete()
  }
}
```

Notice how these functions no longer modify `jokes` or call `updatePage()`? That''s because when we modify the database, or `onSnapshot` function already does all this for us.

Now we''re playing with fire! 🔥

~~~ {.note}
If you want to learn more about Firestore, there is a good [Getting Started Guide](https://firebase.google.com/docs/firestore/quickstart) and [reference documentation](https://firebase.google.com/docs/reference/js/firebase.firestore).

If you want to try out the Firebase version of Joke-a-tron, you can visit [joke-a-tron-9001.surge.sh](https://joke-a-tron-9001.surge.sh) or view the source on [GitHub](https://github.com/egillespie/joke-a-tron-firebase).

Open the page in two tabs and watch them both change whenever you add or remove a joke on one tab. 🤯
~~~
', NULL, '-KgucykEgMdZxwT4LtxO', 'Make an anonymous messaging app that anyone can moderate', 'Surge', 14);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (240, 'js-react-intro', 'Wrangling JavaScript with React', 2, '## Building your first React component

Maybe you heard about React from your friend. Or maybe you saw a job posting asking for React experience. Possibly even stumbled across it when searching the Internet for your other lessons. No? That''s OK too.

[React](https://reactjs.org) is a JavaScript library originally made by Facebook. Facebook created it for their own website, and then chose to release it as Open Source Software (that is, make it freely available to everyone). Many frontend programmers are using React to build their websites, and you''re about to see why!

![y''all ready for this](https://i.imgur.com/6qBMIXy.png)

### Hello World

[It is customary](https://www.quora.com/What-is-the-origin-of-Hello-World) when learning a new technology to write out "Hello World", so let''s do that using React. You can follow along and change this example and any others by clicking _Edit on Codepen_.

<iframe height=''350'' scrolling=''no'' title=''Hello World in React'' src=''//codepen.io/hcodelab/embed/oNzxgpP/?height=265&theme-id=dark&default-tab=js,result&embed-version=2'' frameborder=''no'' allowtransparency=''true'' allowfullscreen=''true'' style=''width: 100%;''>See the Pen <a href=''https://codepen.io/hcodelab/pen/oNzxgpP/''>Hello World in React</a> by Andrew Thal (<a href=''https://codepen.io/athal7''>@athal7</a>) on <a href=''https://codepen.io''>CodePen</a>.
</iframe>

You might be saying to yourself "wait this _kind of_ looks like HTML", and you''re right! This HTML-like syntax is called [*JSX*](https://reactjs.org/docs/introducing-jsx.html), and is how you call React components.

Let''s break down what we just did. First we define a class called `Hello`, as a [child](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) of `React.Component` using the `extends` keyword. 

``` {.jsx}
class Hello extends React.Component {
```

~~~ {.note}
#### What are `class` and `extends`?

Some of the new keywords you see in this lesson, such as `class` and `extends`, have nothing to do with React. They''re part of the JavaScript language, just like `const`, `for`, and `if`, and you can use them in more than just websites made with React.

React uses these keywords to organize components and give them consistent structure and behavior. For example, as soon as you read `extends React.Component` you know that the rest of the code is creating a React component.

These new keywords are modern JavaScript features and a pretty big topic to cover. Fortunately, we don''t need to completely understand them in order to use them. In this lesson, we''ll stick to creating React components with them and save the bigger explanation for later. 😉
~~~

The only method that `React.Component` requires in a child class is called `render`. This is where you choose what HTML gets written to the page when this component gets called.

``` {.jsx}
class Hello extends React.Component {
  render () {
    return (
      <div>Hello {this.props.name}</div>
    )
  }
}
```

~~~ {.note}
Here''s JSX cropping up again in the `render` method. JSX can be used inside of components too, allowing you to call components from inside other components 🙌.
~~~

Check out the [interpolation](https://en.wikipedia.org/wiki/String_interpolation) `{this.props.name}`. This syntax is the magic that lets you reuse the component with different information. By passing different arguments (props) to the component, you can use the same code to show different information. 

For example, `<Hello name="World" />` would show "Hello World", and `<Hello name="Jane" />` would show "Hello Jane".

The last piece of the code is how the `Hello` component gets onto the page:

``` {.jsx}
ReactDOM.render(
  <Hello name="World" />,
  document.getElementById(''container'')
)
```

Here we choose what React component we want to use (`Hello`) with the arguments desired (`name="World"`) and where on the page we want the component to go (`document.getElementById(''container'')`). 

The HTML for this page is very simple (`<div id="container"></div>`), because we are making the component do the hard work!

## Using components in a loop

Writing a component once and using it over and over again is hands-down awesome.

There are lots of times where you''ll have a lot of similar-looking data that you want to show in a list: blog articles, Facebook posts, project criteria 😉, dropdown menus, and so much more.

In React, you can create a whole bunch of HTML in a loop by using the [`map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) function.

### Looping with a JavaScript array

If we have data in an array -- `[3, 7, 9]`, `[''Bubbles'', ''Blossom'', ''Buttercup'']`, or anything else surrounded by square `[]` brackets -- then we can call `map` like this:

``` {.jsx}
class HelloEverybody extends React.Component {
  render () {
    const names = [''Bubbles'', ''Blossom'', ''Buttercup'']
    return names.map(function (name) {
      return <Hello key={name} name={name} />
    })
  }
}
```

Let''s break down how we''re using `names.map(function (name) { })`:

* `names` is the variable containing our data, an array with the values `[''Bubbles'', ''Blossom'', ''Buttercup'']`
* `.map` calls the `map` function on our array of data
* `function (name) { }` is the argument we provide to the `map` function and will be called once for every value in our array
* A unique `key` is provided to each component so that React knows which one to update of our array changes

In this example, we use `map` to call a function for three names. The function passes a name to our `Hello` component and returns the result.

Here''s another example that shows the output from calling `map`. Notice how the `key` attribute does not affect the output? That''s because it''s only used by React.

``` {.jsx}
const names = [''Bubbles'', ''Blossom'', ''Buttercup'']
names.map(function (name) {
  return <Hello key={name} name={name} />
})
```

``` {.output}
[
  <Hello name="Bubbles" />,
  <Hello name="Blossom" />,
  <Hello name="Buttercup" />
]
```

Another way to think about `map` is that it uses values from one array to create a new array of the same size, but with different values.

When a `render` function returns an array, React will automatically show every component from the array on the page, in order:

![three printed greetings](https://i.imgur.com/vKzoNlq.png)

### Looping with JavaScript objects

Sometimes our data won''t be in an array, it will be in a big JavaScript object, like this:

``` {.js}
const team = {
  384792: {
    name: ''Blossom'',
    color: ''red'',
    ingredient: ''everything nice''
  },
  987234: {
    name: ''Bubbles'',
    color: ''blue'',
    ingredient: ''sugar''
  },
  997384: {
    name: ''Buttercup'',
    color: ''green'',
    ingredient: ''spice''
  }
}
```

So how can we print the names when our data looks like this?
 
We''ll still use `map`, but not directly. When using objects, we first get the keys for our data (`384792`, `987234`, `997384`, etc.). Then we call `map` and use the key to get each of our objects. Like this:

``` {.jsx}
class HelloEverybody extends React.Component {
  render () {
    const team = {
      384792: {
        name: ''Blossom'',
        color: ''red'',
        ingredient: ''everything nice''
      },
      987234: {
        name: ''Bubbles'',
        color: ''blue'',
        ingredient: ''sugar''
      },
      997384: {
        name: ''Buttercup'',
        color: ''green'',
        ingredient: ''spice''
      }
    }

    return Object.keys(team).map(function (key) {
      return <Hello key={key} name={team[key].name} />
    })
  }
}
```

The important bit of code in this example is:

``` {.jsx}
return Object.keys(team).map(function (key) {
  return <Hello key={key} name={team[key].name} />
})
```

Let''s break it down just like we did the first time we called `map`:

* `Object.keys(team)` gives us an array containing the keys of every item in `team`: `[384792, 987234, 997384]`)
* Using the array of keys, we call `map` and provide a function that will be called for each key in the array
* We use `key={key}` to tell React that the key of each object can be used to uniquely identify each component that we produce
* Our function uses `team[key].name` to get the name of each team member

That last bit is especially exciting -- we can access objects, properties, and all kinds of data inside our components just like we would with plain, old JavaScript!

![powerpuff girls](https://i.imgur.com/WG8ILpX.png)

## Letting React do the work

Remember [that app we built](https://jsfiddle.net/chrisvfritz/yjea0mmq/embedded/js,html,result/) for a chain of stores? You might have noticed by the end that the logic was becoming fairly complex. Keeping track of those nested `if` statements and which HTML element to write `textContent` is hard. As the code (inevitably) changes, you can be left with confusing errors, not to mention headaches!

![there has got to be a better way](https://i.imgur.com/96OJJge.png)

One of the best benefits you get from React is that it will re-render the component whenever the data (React calls this *state*) changes, automatically.

### Preparing your project

The first thing that we need to do is be able to serve an HTML file where we can include the React framework and our JavaScript. In the `index.html` file, we will want to include your React component, as well as some scripts to translate the React code into something the browser can understand.

``` {#index.html}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Hello World</title>
  </head>
  <body>
    <div id="container"></div>
    <script src="hello.jsx" type="text/babel"></script>

    <script src="https://unpkg.com/react@16/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>

    <!-- Don''t use this in production: -->
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js"></script>
  </body>
</html>
```

And in the same directory as our HTML, we can create our Hello World Component.

``` {#hello.jsx}
class Hello extends React.Component {
  render () {
    return (
      <div>Hello {this.props.name}</div>
    )
  }
}

ReactDOM.render(
  <Hello name="World" />,
  document.getElementById(''container'')
)
```

### Building the initial component

Using our previous Store project, before anything is selected, the *initial state object* would look something like this:

``` {.jsx}
const state = {
  selectedEmployee: null,
  requestedInfo: null
}
```

In React, you set the initial state in the `constructor` method:

``` {.jsx}
class Hello extends React.Component {
  constructor (props) {
    super(props)
    this.state = { 
      selectedEmployee: null,
      requestedInfo: null
    }
  }
  ...
}
```

~~~ {.note}
`super(props)` may be new syntax for you. All it does is call the same function on the parent class. In this case that means calling the `constructor` method on the `React.Component` class.
~~~

And then you can include the state in the HTML

``` {.jsx}
class Hello extends React.Component {
  ...
  render () {
    return (
      <div>
        <div>Employee: {this.state.selectedEmployee}</div>
        <div>Info: {this.state.requestedInfo}</div>
      </div>
    )
  }
}
```

Any time the state changes, React will re-render the component. What''s even better is that React _knows_ what the component looked like before, and it will _only_ change the parts on the page that are different. This is a feature called [Virtual DOM](https://reactjs.org/docs/faq-internals.html).

So now the question is, how do you change the state?

![change](https://i.imgur.com/oeGNGXg.png)

### Handling events

The store app that we built before has a couple of select boxes for someone to choose what information she wants to see. Fortunately, it''s easy to get notified when those change by binding a handler to the select element.

``` {.jsx}
class Hello extends React.Component {
  constructor () {
    ...
    this.handleChange = this.handleChange.bind(this)
  }

  render () {
    return (
      <div>
        ...
        <select name=''selectedEmployee'' onChange={this.handleChange}>
          <option />
          ...
        </select>
      </div>
    )
  }
}
```

~~~ {.note}
`this.handleChange.bind(this)` can be a bit confusing. It''s only important so that `this` can get called in the callback function, but don''t worry about it too much.

~~~

The `handleChange` method can update the component state, based on the `name` attribute for the select box that was changed:

``` {.jsx}
handleChange (event) {
  const stateChange = {}
  stateChange[event.target.name] = event.target.value
  this.setState(stateChange)
}
```

If the `selectedEmployee` box is used, this code would now update the component state to `{selectedEmployee: ''selection'', requestedInfo: null}`, and the component will re-render with the new state!

## Organizing your components

Based on the code so far, doubts about the promise of React might be creeping in. There is so much code just to put something on the page. Isn''t it easier just to update the code as needed? Isn''t there going to be a lot of duplication when we put it all together?

Some of these are fair criticisms of React. React does require some extra boilerplate, but it does start to pay off with more complex applications. Hope is not lost for our small application though, we have another trick up our sleeve...

### Reusing components

In addition to automatic rendering based on state changes, one of the other strengths of React is the ability to reuse components. We touched on that a little bit when passing in the `name="World"` props in the Hello World example.

In the original store app, the HTML surrounding the two select boxes look pretty similar:

``` {.html}
<div>
  <label>Employee</label>
  <select id="employee">
    <option value="">None</option>
    <option value="manager">Manager</option>
    <option value="assistantManager">Asst. Manager</option>
  </select>
</div>

<div>
  <label>Information</label>
  <select id="employee-info">
    <option value="">None</option>
    <option value="firstName">First Name</option>
    <option value="lastName">Last Name</option>
    <option value="age">Age</option>
  </select>
</div>
```

If we extract those into a single component, we can simplify the code through reuse. Maybe something that looks like this:

``` {.jsx}
class StoreSelect extends React.Component {
  render () {
    const { label, id, options } = this.props 
    return (
      <div>
        <label>{label}</label>
        <select id={id}>
          <option />
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    )
  }
}
```

~~~ {.note}
See that part `const { label, id, options } = this.props`? This is using a newer JavaScript feature called [Destructuring Assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment). This feature isn''t yet supported in every browser, but you should be fine using it wherever you can use React.

Also the `<option />` is shorthand for a blank option. Some React components give nice shortcuts for doing common things. For example you can indicate which option has been chosen just on the select element itself `<select value={somevalue}>` instead of having to programmatically find the `<option>` tag to add the `selected` attribute.
~~~

With this pattern, not only will the select boxes look the same, but it is simple to add more of them, and to change how all of them look by only updating in one place. You could even say that it will make us more _React_-ive to inevitable changes 🤣.

### Putting it all together

With all of these new tools in mind, let''s see what our final product looks like (keeping in mind [where we started](https://jsfiddle.net/chrisvfritz/yjea0mmq/embedded/js,html,result/)).

<iframe height=''600'' scrolling=''no'' title=''Store App'' src=''//codepen.io/hcodelab/embed/dypMPdg/?height=265&theme-id=dark&default-tab=js,result&embed-version=2'' frameborder=''no'' allowtransparency=''true'' allowfullscreen=''true'' style=''width: 100%;''>See the Pen <a href=''https://codepen.io/hcodelab/pen/dypMPdg/''>Store App</a> by Andrew Thal (<a href=''https://codepen.io/athal7''>@athal7</a>) on <a href=''https://codepen.io''>CodePen</a>.
</iframe>

## Using React

Great job building your first React application! Now that you understand how to think in React components, you can start applying React to all kinds of projects. Just a few more tips to help you on your way.

![here we go](https://i.imgur.com/azIrqgd.png)

### Lifecycle Hooks

There are cases where you want to build functionality that''s not just in the initialization of the component or during rendering. For example, if you need to get data from a database or API to set state. You wouldn''t want to do this in the `constructor`, because it would make the page stop rendering while the call is in progress. 

This is an example of when you would want to use a *Lifecycle Hook*—a method on React components that gets called at specific points in the rendering process. For this particular example you would want to use `componentDidMount`, which gets called just after the component is placed on the page for the first time. React has [great documentation](https://reactjs.org/docs/react-component.html) about all of the options available to you when building our your components...they really have thought of everything!

### JSX

That HTML-looking syntax we saw earlier...it''s really nice to use, but it doesn''t come for free. The price you have to pay is a little more up front configuration to include code that knows how to turn it into JavaScript. Fortunately there is [good documentation](https://reactjs.org/docs/add-react-to-a-website.html#optional-try-react-with-jsx) on how to do this, and it''s pretty straightforward.

~~~ {.note}
You might be experiencing some déjà vu with this extra configuration. JSX is able to be used as a preprocessor, similar to how Sass is used as a preprocessor to let you write more advanced CSS.
~~~

### CSS

If you want to write CSS like you''re used to, you absolutely can with React. There''s one important thing to know, though: *use `className` style your elements instead of `class`*. `class` is a [reserved word](https://en.wikipedia.org/wiki/Reserved_word) in JavaScript and browsers can''t tell if you are trying to use JavaScript or HTML/JSX.

If you are up for an adventure, there are some [really powerful patterns](https://reactjs.org/docs/faq-styling.html) for including CSS directly inside your React components. This way of styling can help protect against having conflicting or deeply nested CSS rules, and assist with reducing bugs and keeping your pages rendering fast.

### Debugging

Because React is being preprocessed into JavaScript that the browser can understand, the default browser debugging tools can end up being a little confusing. Fortunately the React team has built a [Chrome Extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) to allow you to inspect the components as you wrote them, from within your browser.

![React Devtools](https://lh3.googleusercontent.com/GjX6Q3_FVJfc0DqE2wiPKkgOfth6otzV-D7GV-wB6sH5_t1oodMaHOBLsYOLeydb85bKWu6X=w640-h400-e365)

## React in the wild

Because of its popularity, there is a *lot* that has been built on top of React to supercharge your development. This section is meant to help direct you towards some extra resources that are likely to be useful on your React journey.

### Managing state with Flux / Redux

As you start getting into more complex applications, you will likely notice that it''s sometimes hard to know where to keep _state_. The store app we built has a strict hierarchy, so it''s easy enough to keep state at the highest level component. Some applications don''t have a strict hierarchy, they have multiple hierarchies, and events in one tree can affect the state of other trees. 

![Redux logo](https://i.imgur.com/rHlSsDe.png)

There is a pattern for organizing state and data flow that Facebook has designed to go along with React, called [Flux](http://facebook.github.io/flux/). Flux is more of a pattern than a usable library, however. A popular library that implements the Flux pattern is called [Redux](https://redux.js.org). Not only does Redux help with data flow and state, but it provides other invaluable tools to help you with automated testing, application structure, and debugging.

### Using plugins

There are many published libraries that provide React components, and you should use them whenever possible over libraries that are not React-specific. This is because they will likely handle state in a React-specific way for you, so you don''t have to take apart the other library to figure how it works. 

One good example of this is the popular [Slick Carousel](http://kenwheeler.github.io/slick/). Just try once to use it inside of a React application and you will realize the pain of trying to fit it into React''s rendering cycle (Why does it keep going back to the first slide? Think about it...). Fortunately there is a [Slick Carousel React Component](https://www.npmjs.com/package/react-slick-carousel) that takes care of this complexity for you, and it''s a breeze to use!

### React Native

There is a trend rising in the industry to try to use the same code for websites and for phone apps. Since React is a generic way of designing UIs, it has been adapted to allow you to program phone interfaces as well! Take a look at the [React Native](https://facebook.github.io/react-native) documentation if you are interested in learning more.

### Web Components Standard

React has gained so much traction in the industry that (in some circles) it has started to become the de-facto standard for writing web applications. Because of that popularity, React-like syntax is being adopted into browsers *natively* through a feature called [Web Components](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements). You can already program using this standard, and can avoid all of the complexity of setting up JSX support and installing the React library. 

As of 2018, GitHub has even replaced all of its jQuery code with Web Components:

![Announcment that GitHub replaced jQuery with Web Components](https://i.imgur.com/SzcZGl6.png)

---

*And that''s it! You''re now ready to build your own website with React!*
', NULL, '-LTXvfN1bIs_5LKrunb0', 'Create an authentic-looking 90s fan site with React', 'Surge', 3);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (5378, 'html-final-project-pitchboard', 'Final Project Pitchboard', 3, '## What is a Pitchboard

Every project has to start somewhere. It''s important to get down on paper, a brief overview of what you''re building, who you''re building it for and what your goals are. This will help you stay focused and aide in on-boarding new designers and developers to your project. A typical pitchboard or brief has the following sections:

1. Project Title
2. A short elevator pitch (1 sentence)
3. A longer elevator pitch (2-3 sentences)
4. Three (3) personas
5. Three (3) competitive sites or projects

### Short and Long Elevator Pitches

The two _pitches_ that make up your pitchboard/project brief are the most important part of the document. The idea here is to initially distill your idea (or the ideas/goals of the project if you''re working with a client) in as short a format as possible. Think about only having a short elevator ride to pitch your idea to an investor or interested party&mdash;use that motivation to write your first draft. Be brief and to the point, knowing that you can add more detail in your long-form pitch.

When someone new to the project is done reading the first two paragraphs or your document--they should have a firm grasp of what the work is all about and what the clients expects.

### Personas

Personas are a realistic representations of the core audience of your site, application or product. They help you focus on a user other then yourself&mdash;hopefully influencing you and your team to make design decisions that are in the best interest of the user you''re trying to reach.

*Detailed reading on personas:*

* [Personas (Usability.gov)](https://www.usability.gov/how-to-and-tools/methods/personas.html)
* [Personas: Why and How You Should Use Them](https://www.interaction-design.org/literature/article/personas-why-and-how-you-should-use-them)

During the ideation and pitchboard stage, you don''t need to completely build a full persona profile (such as the 1-2 page representations noted in the detailed reading). Generally a name or title and brief description are all that''s necessary. As you work through your design process, you''ll create more detail around (or even change) your initial persona concepts.

### Comps (Comparables)

When you go to buy or sell a car or house (or any bigger-ticket item, really), you usually compare the asking price to the price of similar vehicles or have a Realtor pull recently sold houses in the area you''re looking to buy. For our pitchboard, comps are sites or applications that currently exist that you''d like to remember in some way. Generally, comparable websites fall into three categories:

1. Competitors (Google, Bing and Yahoo)
2. Feature (I like the checkout feature of Amazon)
3. Design/Content (I like the way this looks and reads)

Comps help set the pace for competitive analysis and can also give you some help when describing your project to someone unfamiliar with the subject.

Make sure you check out the notes form the [pre-production lecture](https://app.gitbook.com/@jsiarto/s/mi-349/lecture-notes#october-22-2019-pre-production)

## Pitchboard Example

#### Title

SuperCorp Players Guide

#### Short Pitch

The SuperCorp Players Guide is the story of our values, how they mold our unique culture, and shape the way we solve problems.

#### Long Pitch

Every decision we make is fundamentally shaped by our values. Whether we’re developing a website that exposes the latest climate data or deciding how best to troubleshoot bugs and communicate their impact to our customers, our values mold our approach to how we do business and develop software. The SuperCorp Players Guide captures this approach, describing the processes, roles, and best practices that are essential to us. It’s meant to be a guide to aid us in choosing projects, building teams, executing work, and interacting with each other... as well as a helpful reminder of why we think and act the way we do. This handbook, then, is both the story of how we have come to our core values and a roadmap to how we solve the problems facing our customers, our company, and our world.

#### Personas

* Client/Partner: Prospective or current business partner
* SuperCorp Recruit: Prospective new hire
* SuperCorp Employee: Current SuperCorp employee

#### Comps

* Valve Employee Handbook
* Dungeons and Dragons
* Information Architects

## Final Project Pitchboard

For this module, you need to create a pitchboard for your final project so that I can approve the topic. You can find the details for the class final project in the [UX Heuristics lecture](https://app.gitbook.com/@jsiarto/s/mi-349/lecture-notes#october-22-2019-pre-production).

Create a pitchboard that communicates your idea for a final project website and format it using HTML and CSS. There are no restrictions to how you design the formatting, but you need to use something other than the default browser styles. Make sure you include an images or external resources in your Github repository so they display correctly in Github Pages.', NULL, NULL, 'Final Project Pitchboard', 'GitHub Pages', 4);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (5532, 'html-final-project-wireframes-and-style-tiles', 'Final Project Wireframes and Style Tiles', 4, '## Wireframes

Wireframes are the intermediary step between concept and final design. They should show enough detail so that developers and stakeholders can make informed decisions from them, but not detailed enough that they communicate any real design direction. Generally, this means that the layout is there in big blocks, but most imagery and color are missing.

You should also make sure to include final copy (writing) in your wireframes so that you make sure the layout and user flow will work well with the content.

 - [Wireframe inspiration](https://dribbble.com/search?q=wireframes)

### Wireframing tools

 - [Wireframe.cc](https://wireframe.cc/)
 - [UXPin](https://www.uxpin.com/)
 - [Balsamiq](https://balsamiq.com/products/)
 
 ## Style Tiles
 
Style Tiles are a design deliverable consisting of fonts, colors and interface elements that communicate the essence of a visual brand for the web. They help form a common visual language between the designers and the stakeholders and provide a catalyst for discussions around the preferences and goals of the client.

Style Tiles are similar to the paint chips and fabric swatches an interior designer gets approval on before designing a room. An interior designer doesn''t design three different rooms for a client at the first kick-off meeting, so why do Web designers design three different webpage mockups?

Learn more about style tiles from our lecture slides.

- [Style Tiles Website](http://styletil.es/)
 
## Copywriting

- [10 Tips on Writing from David Ogilvy](https://signalvnoise.com/posts/3351-link-10-tips-on-writing-from-david-ogilvy)
- [Writing Decisions: Saving space without losing meaning](https://signalvnoise.com/posts/1539-writing-decisions-saving-space-without-losing-meaning)', NULL, NULL, 'Create a Wireframe and Style Tiles', 'GitHub Pages', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (5541, 'html-final-project-submission', 'Final Project Website Submission', 5, '## Final Project Details

- Read the [full requirements for the final project](https://jsiarto.gitbook.io/mi-349/final-project).', 'NOTE: You don''t have to use GitHub Pages for submission. You can use Surge, or any other hosting you''d like. Please make a note in your GitHub issue when you submit your final work.', NULL, 'Final Project Submission', 'GitHub Pages', 1);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (3752, 'sql-intro-to-relational-data', 'Use a database and SQL to keep track of your data', 2, '## What''s a database, and why do we need it?

When we created our lemonade stand API in the previous lesson, you may have noticed something strange: any time we restarted our server, all of our data got reset, too!

This happened because we stored all of our data in a JavaScript variable:

``` {#products.js}
module.exports = {
  ''lemonade'': {
    name: ''Lemonade'',
    price: ''$1.00''
  },
  ''ice-water'': {
    name: ''Ice water'',
    price: ''$0.00''
  },
  ''chocolate-chip-cookies'': {
    name: ''Chocolate chip cookies'',
    price: ''$1.50''
  }
}
```

Each time our server starts, this file runs and recreates our menu with three products: lemonade, ice water, and chocolate chip cookies. And even though our API lets us change the products, those changes happen in our server''s temporary memory. In other words, changing our products doesn''t actually change our `products.js` file.

Information kept in memory is volatile -- it can change quickly and in surprising ways. If our server restarts for any reason whatsoever, like if the power goes out or we change our code, everything in our computer''s memory will go away, including our list of products. 😭

![men in black memory neuralyzer](https://i.imgur.com/rmy6mIL.png)

### A case for the database

We don''t want our products to change just because the power goes out, though. We want our price changes, new items, and out-of-season stuff we''ve removed to stay that way, even if the power goes out for a week!

One way to solve this problem is to use a *database*. Databases store information on hard drives or other long-term storage and let us access it from other computers.

If you''re familiar with Firebase, you may have already seen this term. There are lots of different types of databases and Firebase is just one kind. In this lesson we''ll learn about a broad category of databases called *relational databases*. This term is sometimes abbreviated to RDBMS or fully expanded to "relational database management system."

Talk about a mouth full... 😛

## What does relational data look like?

Before we start using a relational database, we have to learn a little bit about how it stores data, and this means learning some new terms.

![can''t stop won''t stop new words](https://i.imgur.com/Inv1um3.png)

### Relational data is stored in tables

The first three terms go together. In a relational database, the data is stored in one or more *tables* and each table is made of *rows* and *columns*.

One database table represents one type of thing that you need to keep track of. In our case, that type of thing is a product. Tables have names that are usually singular and made of only lowercase letters and underscores (`_`). A good name for our table would be `product`.

Here''s what our `product` table might look like:

<table>
  <thead>
    <tr>
      <th><code>slug</code></th>
      <th><code>name</code></th>
      <th><code>price</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>lemonade</td>
      <td>Lemonade</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>ice-water</td>
      <td>Ice water</td>
      <td>0.00</td>
    </tr>
    <tr>
      <td>chocolate-chip-cookies</td>
      <td>Chocolate chip cookies</td>
      <td>1.50</td>
    </tr>
</table>

### Columns describe the types of data in a table

Each column in our table is a different attribute of the data we want to put in that table. Each product, for example, will have a `slug`, a `name`, and a `price`. Like tables, each column has a name that is singular and made of only lowercase letters and underscores (`_`).

When we create our table, we''ll also tell the database other information about each column, like what type of data you can put in it. We''ll explore those details later.

### Rows are good, clean data

After a table is created, it will not contain any rows until we add them.

In order to add rows, we''ll write some code in our API that will create a new row each time a `POST` request is made. Once a row is added to a table, it will stay there until some other code changes or deletes it.

Databases also make sure that if the power goes out in the middle of adding a row, we don''t end up with something like this:

<table>
  <thead>
    <tr>
      <th><code>slug</code></th>
      <th><code>name</code></th>
      <th><code>price</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>lemonade</td>
      <td>Lemona💥</td>
      <td></td>
    </tr>
</table>

If a row is added to a table, we know with certainty that the data is valid and complete. This is true of adding rows, changing rows, and deleting rows in a table.

### Identifying a row in a table

If we want to use a database to store the information from our API, we know that we will need to create, update, delete, and retrieve individual rows from our table. So how do we uniquely identify a row in our table?

We _could_ use the slug to look up a row, but what if we rebrand and switch from lemons to limes? Wouldn''t it make sense to change both the product name _and_ slug from lemonade to limeade? Right now our API doesn''t do that...

If we update our API to allow slugs to be renamed, another problem can happen: someone can get our product list, look it over for a few minutes, then order the lemonade that no longer goes by that name. Their order can''t be fulfilled! And that''s when the bad Yelp reviews start pouring in. All from one sour customer experience.

Our business is ruined and all we have left is this punny story. 🍋

![this is unacceptable](https://i.imgur.com/F8tb5BJ.png)

To avoid this catastrophe, we''ll add a new column to our table to uniquely identify each row. It will be a number, because computers are super fast when it comes to numbers. Oh, and the database will generate these numbers for us, too. That way we don''t have to worry about accidentally using a number that''s already been used.

<table>
  <thead>
    <tr>
      <th><code>id</code></th>
      <th><code>slug</code></th>
      <th><code>name</code></th>
      <th><code>price</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>lemonade</td>
      <td>Lemonade</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td>ice-water</td>
      <td>Ice water</td>
      <td>0.00</td>
    </tr>
    <tr>
      <td>3</td>
      <td>chocolate-chip-cookies</td>
      <td>Chocolate chip cookies</td>
      <td>1.50</td>
    </tr>
</table>

This value that the database (and our API) will use to identify a row is called a *primary key*. It won''t mean anything to our customers, but it will never change and the database will guarantee that it''s unique.

We''re back in business! 🤑

## Modeling data and creating tables

Okay, we want to keep our products in a database table. Before we can do that, we have to create the table, and before we can create the table, we need to decide which columns will go in that table.

### Data modeling for fun and profit

The process of choosing which tables and columns you need for a project is called _data modeling_.

It helps to look at a sample of your data to decide what types to choose. Let''s look at our starter menu again:

<table>
  <thead>
    <tr>
      <th><code>id</code></th>
      <th><code>slug</code></th>
      <th><code>name</code></th>
      <th><code>price</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>lemonade</td>
      <td>Lemonade</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td>ice-water</td>
      <td>Ice water</td>
      <td>0.00</td>
    </tr>
    <tr>
      <td>3</td>
      <td>chocolate-chip-cookies</td>
      <td>Chocolate chip cookies</td>
      <td>1.50</td>
    </tr>
</table>

Now let''s describe our four columns:

* `id` is automatically-generated, a number, and our primary key
* `slug` is a string of characters derived from `name` and is required
* `name` is one or more words and is required
* `price` is money (a number with two decimal places) and is required

This gives us a general sense of what are table will look like, but databases like to be specific. On top of that, there are only a few data types that all relational databases understand.

### Choosing good data types

To go from generic data types like "automatically-generated numeric primary key", "string of characters", "words", and "money", we''ll have to look up the data types for the specific database we''re using, and the database we''re going to use is called *Postgres*.

~~~ {.note}
[Postgres](https://www.postgresql.org/) is a free relational database that has lots of features and is very popular. We chose it because it''s easy to use on Heroku and doesn''t require you to install any additional software.

Here are some other popular relational databases:

* [MySQL](https://www.mysql.com/) is another common choice for hobby development
* [SQLite](https://sqlite.org/) is small and works well on mobile devices
* [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) is Microsoft''s enterprise database that works especially well with other Microsoft products
* [Oracle](https://www.oracle.com/) is used mostly by growing businesses that need guaranteed reliability and support
~~~

Finding a list of data types for a specific database is as simple as searching the Internet for the name of the database and "data types". We''ll save you the trouble and link directly to the [Postgres Data Types](https://www.postgresql.org/docs/10/static/datatype.html).

Oh look, the first few links on the page are exactly what we need!

![First few Postgres data types](https://i.imgur.com/3cQJhMM.png)

If you take the time to read about some of those data types, it may seem technical and intimidating. Don''t do that just yet!

Here''s a short summary of the most common data types that you will need to use:

* *Numeric Types*

  * `integer` is a number without a decimal point (e.g. -8, 0, 1, and 837)
  * `numeric(p,s)` is a number with a _precision_ and a _scale_, where precision is the total number of digits allowed and scale is the number of digits on the right of the decimal point (e.g. `numeric(3,1)` would allow 12.1 but not 2.05 or 123.4)
  * `serial` is an integer that automatically increments when a row is added (e.g. 1, 2, 3, 4)

* *Character Types*

  * `varchar(n)` is a string of characters with a maximum length (e.g. `varchar(5)` would let us save "hello" and "goodb" but not "goodbye")
  * `text` is a string of characters with no maximum length

* *Date/Time Types*

  * `date` contains only month, day, and year (e.g. "2018-12-17")
  * `time` contains only hours, minutes, and seconds (e.g. "23:49:08")
  * `timestamp` contains both a date and time (e.g. "1999-01-08 04:05:06")

* *Boolean Type*

  * `boolean` allows either `true` or `false`

With these data types, we have everything we need to go from our generic types to specific Postgres data types:

* `id` can be a `serial` type because it''s a number that automatically gets set and incremented
* `slug` can be a `text` type because it''s a string and we don''t have a limit on how long a slug can be
* `name` can also be a `text` type because it''s a string and doesn''t have a length restriction
* `price` can be `numeric(5,2)` because we don''t plan on selling anything more expensive than $999.99

### Using DDL to create tables

Now that we''ve picked the data types for the columns in our table, we can tell the database how to create the table. Finally!

![m.c. escher table and chair](https://i.imgur.com/ZKeHTR7.png)

To do this, we''ll use a special language called DDL, which is an abbreviation for data definition language.

Let''s get a sense of what DDL looks like by creating a new text file named `product.ddl` and typing this in it:

``` {#product.ddl}
create table product (
  id serial primary key,
  slug text not null,
  name text not null,
  price numeric(5,2) not null
);
```

We''ll break this down line by line.

#### Line 1: `create table product (`

Any time you want to create a table in a relational database, the DDL will start with `create table` and the name of the table (`product` in our case).

The list of columns comes next. They all go between a matching pair of parentheses: `(` and `)`, with a comma between each column. It looks a lot like calling a function in JavaScript.

#### Line 2: `id serial primary key,`

Each column definition begins with the name of the column. It''s common to list the primary key column(s) first in a table, so we''re starting with `id` for our table.

The second part of a column definition is the data type. We chose `serial` so that the value will be a number that is automatically generated.

The name and data type are the only required values to define a column. However, there are other attributes of columns, and those all come after the data type. One such attribute is `primary key`, which yep, you guessed it, means the column is the table''s primary key.

Since we have more columns in the table, we end the line with a `,`.

#### Line 3: `slug text not null,`

Similar to the previous line, we see the name of the column followed by the data type: `slug text`.

The third attribute, `not null`, means a value is always required in this column. If we ever try to insert a row with a slug set to `null` or `''''` (an empty string), the database will reject the value and the row will not be inserted!

We still have more columns in the table, so this line ends with `,` too.

#### Line 4: `name text not null,`

Like `slug`, our `name` column is a required string, so we define the column as `name text not null`. We have one more column to add, so we end the line with `,`.

#### Line 5: `price numeric(5,2) not null`

For the price of our products, we chose a `numeric` data type with precision 5 and scale 2. This means the most we can sell a product for is $999.99 (5 total digits and 2 digits after the decimal).

If we ever try to set the price of a product even one penny more than $999.99, the database will reject our price. So picky!

Price is also required at our shop (this is a business after all), so we''re setting `not null` on this column.

And hey, there aren''t any more columns to define in our table, so no `,` at the end of the line.

#### Line 6: `);`

The `)` matches the `(` on line 1 and closes our column definition.

The `;` indicates that the previous command is ready to run. If we wanted to create another table in the same DDL file, we would start the next `create table` command on the next line _after_ the `;`.

### Getting rid of a table with DDL

We''re all human, we make mistakes. We''re also coders, so we make _lots_ of mistakes.

![we all make mistakes and can do better](https://i.imgur.com/CeUAmAU.png)

When we set out to create our database tables, it''s very likely that we won''t create them right on the first try. So how do we get rid of a table and start over?

We run the `drop table` command, that''s how! If you call `drop table` followed by the table name and a `;`, the database will remove the entire table, data and all.

Suppose we accidentally named our table `prodcut` instead of `product`. To start over, we would run `drop table prodcut;`. After that, we can fix our typo and rerun our `create table` command.

~~~ {.danger}
Dropping a table also destroys all of the data in the table. There is also no way to get a table back once it''s been dropped, so be very careful when running the `drop table` command!

If you need to fix a mistake without losing the data, there are other commands that you can run. For Postgres, most of these commands can be found in the [`alter table` documentation](https://www.postgresql.org/docs/10/static/sql-altertable.html).
~~~

## Using SQL to create, read, update, and delete information

We have a database tables now, but it''s kind of just... sitting there. To make that table useful, we''re going to explore yet another language made specifically for working with relational data: *SQL*.

SQL stands for structured query language. It''s a way for us to create, read, update, and delete information in a relational database. And unlike DDL, a lot of the SQL language that you learn will work in any relational database, not just Postgres.

Here''s to only learning one way to do something! 😂

~~~ {.note}
SQL is an abbreviation that some people pronounce as "sequel" while others say each letter ("S-Q-L"). Either is acceptable. Pick whichever one you like best.
~~~

### Create a row with `insert into`

Since we have an empty table, let''s first learn how to put new data in it. To do that, we use a SQL statement called `insert into`.

It looks like this:

``` {.sql}
insert into product (slug, name, price)
values (''lemonade'', ''Lemonade'', 1);
```

Creating a single row in a table will always begin with the keywords `insert into`, followed by the name of the table where you''re adding the row.

After the table name is a list of column names separated by commas and surrounded with parentheses. Make sure to put every column that was defined `not null` in this list. Also, since our `id` column is automatically generated for us, we can leave it out!

Next is the keyword `values`. After `values` comes the actual list of values that will be inserted. Again, surround the list with parentheses and separate the values with commas.

~~~ {.warning}
The values must be provided in the same order as the list of columns. Otherwise you may get an error or put a value in the wrong column!
~~~

Notice how strings are wrapped in apostrophes (`''`)? Most databases will complain if you try to use anything else. And if you ever need to insert a string that has an apostrophe in it, use two of them (`''''`), like this:

``` {.sql}
insert into product (slug, name, price)
values (''mikes'', ''Mike''''s Soft Lemonade'', 2);
```

And just like DDL, make sure to end the command with `;`.

### Retrieve all information with `select`

With some data in our table, let''s get it back out. All of it.

To do this, we use the `select` command like this:

``` {.sql}
select * from product;
```

This is the most basic way to get information from a table. Let''s break it down:

* `select` means "get"
* `*` means "every column value" and is pronounced "star"
* `from` tells the database we''re about to tell it which table the data is in
* `product` is the name of the table where our data is located

So we can read this statement as "select star from product" or "get every column value from product". It''s kind of pronounceable, isn''t it?

One more note about `*`. It''s a shortcut that saves us from having to type the names of every column in our table. We could also have written this:

``` {.sql}
select id, slug, name, price from product;
```

Either way, the results would be the same:

<table>
  <thead>
    <tr>
      <th><code>id</code></th>
      <th><code>slug</code></th>
      <th><code>name</code></th>
      <th><code>price</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>lemonade</td>
      <td>Lemonade</td>
      <td>1.00</td>
    </tr>
    <tr>
      <td>2</td>
      <td>mikes</td>
      <td>Mike''s Soft Lemonade</td>
      <td>2.00</td>
    </tr>
</table>

### Filtering your results with `where`

SQL let''s us do a lot more than get everything from a table. The next thing we may want to do is find some rows instead of all of them.

Here''s an example of how we could look up a product using its primary key:

``` {.sql}
select * from product
where id = 1;
```

Here''s how we find a product using its slug:

``` {.sql}
select * from product
where slug = ''lemonade'';
```

And here''s how we find every product that costs $1.00 or less:

``` {.sql}
select * from product
where price <= 1;
```

All three of these statements (also known as "queries") will give us the same result:

<table>
  <thead>
    <tr>
      <th><code>id</code></th>
      <th><code>slug</code></th>
      <th><code>name</code></th>
      <th><code>price</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td>lemonade</td>
      <td>Lemonade</td>
      <td>1.00</td>
    </tr>
</table>

We start by writing the same `select` that will give us all of the data from our table.

Then we use the `where` keyword to tell the database that we have conditions that must be met for any data that will be returned. These conditions are a little bit like an `if` in JavaScript, except that we use `=` to compare two values in SQL instead of `===`.

You can also use `and` or `or` in your conditions just like you would use `&&` and `||` in JavaScript:

``` {.sql}
select * from product
where slug = ''lemonade''
or slug = ''mikes'';
```

If you want to find records that do not match a certain condition, you can use `<>` to check if a column _does not equal_ a value. For example, to find every product that is not lemonade, you can use this query:

``` {.sql}
select * from product
where slug <> ''lemonade'';
```

### Remove rows using `delete`

If we want to remove rows from a database table, we''ll use a `delete` statement. Deleting works a lot like selecting, with the exception that you do not provide a list of column to return because deleting always affects whole rows.

They''re so similar that we recommend you write a `select` statement first, check that the results are what you actually want to delete, and then replace the `select *` with `delete`.

![please try this](https://i.imgur.com/WN2f55o.png)

For example, you can remove all of the rows in a table like this:

``` {.sql}
delete from product;
```

If you only want to remove some rows, you can add a `where` condition to your `delete` statement:

``` {.sql}
delete from product
where slug = ''mikes'';
```

~~~ {.danger}
Once your `delete` statement runs, the rows will be gone, so be careful with these commands!
~~~

### Change information with `update`

The last way we''ll interact with our data in this lesson is to change values in columns. This usually involves using a `where` condition to identify the row(s) that should be updated and providing the new values for each column you want to change.

This type of statement is called an `update` and unlike a `select` statement, we''ll provide the name of the table first, and then the columns we want to change. We can use `where` conditions here, too, and like all other SQL statements, if we don''t use a `where` condition, _all_ rows will be affected.

Here''s an example of how we would change the price of our lemonade:

``` {.sql}
update product
set price = 1.5
where id = 1;
```

In the above example, we first use the `update` keyword to tell the database we want to change some data. Then we provide the name of the table.

The `set` keyword then allows us to provide one or more column names and the new values that we want to assign to them. If we want to change more than one column''s value, we would do it like this:

``` {.sql}
update product
set slug = ''limeade'', name = ''Limeade''
where id = 1;
```

If we leave off the `where` condition or our `where` condition results in more than one row, the `update` statement will assign new values to _every_ row!

This change would set the price of every product to $0.50:

``` {.sql}
update product
set price = 0.50;
```

We can also use the current value of a column to calculate a new value. For example, if we wanted to cut all of our prices in half, we could do it with this one statement:

``` {.sql}
update product
set price = price / 2;
```

Changing our prices for happy hour couldn''t get any simpler!

![did someone say happy hour?](https://i.imgur.com/ngRH5tR.png)

~~~ {.note}
### Seeing the results of an `insert` or `update`

One really helpful feature that Postgres offers that is not a standard part of SQL is seeing the results of your `insert` or `update` statements _after_ they run.

If we want to get the values from rows we just created or changed, we can end our `insert` or `update` statement with `returning *`, like this:

``` {.sql}
insert into product (slug, name, price)
values (''water'', ''Fresh water'', 0)
returning *;
```

This will first make the change we requested, then it will show us the new values, including any automatically generated ones like our `serial` primary key:

<table>
  <thead>
    <tr>
      <th><code>id</code></th>
      <th><code>slug</code></th>
      <th><code>name</code></th>
      <th><code>price</code></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>3</td>
      <td>water</td>
      <td>Fresh water</td>
      <td>0.00</td>
    </tr>
</table>

As we''ll see very soon, using `returning *` is especially helpful when writing an API because we always want the caller to see the results of the changes.

Just remember that this only works in Postgres, mmkay? 😉
~~~

## Using a Postgres database on Heroku

Now that we know how to create tables and play with the data in them, it would be super nice to put this newfound knowledge to use. The great news is that we don''t have to install a database server to get started!

![let''s begin](https://i.imgur.com/OupTmtn.png)

### Creating a new database

To create a database that we can play around in, we first need to locate one of our old Heroku projects. If you don''t remember which projects used Heroku, you can visit your [Heroku Dashboard](https://dashboard.heroku.com/apps) to see a list.

With one of these projects in mind, open a terminal window and change to the directory where that project is located.

Then, create your database by running the following command:

``` {.sh}
heroku addons:create heroku-postgresql:hobby-dev
```

This will create a free Postgres database as an add-on to your Heroku project. If you ever want to see what add-ons you''re using for all of your Heroku projects, you can run this command:

``` {.sh}
heroku addons
```

### Install the Postgres client

We now have our very own Postgres database, but before we can use it, we have to connect to it.

And in order to connect to a database, we need the right *client*. A client is a special piece of software that knows how to talk to software running on another computer, like a database. Since we created a Postgres database, we will need the Postgres client.

Install the Postgres client by following these *[setup instructions](https://devcenter.heroku.com/articles/heroku-postgresql#local-setup)* for your operating system.

Once you''re done, close and reopen any of your terminal windows.

### Connecting to the database in a terminal

Now that we have the handy-dandy Postgres client installed, we can try connecting to our new database!

Let''s change to the directory where our Heroku project is located and then run this command to connect to the database:

``` {.sh}
heroku pg:psql
```

If it works, we''ll see some output like this:

``` {.output}
--> Connecting to postgresql-asymmetrical-62030
psql (10.5, server 10.4 (Ubuntu 10.4-2.pgdg14.04+1))
SSL connection (protocol: TLSv1.2, cipher:
ECDHE-RSA-AES256-GCM-SHA384, bits: 256, compression: off)
Type "help" for help.

js-create-an-api::DATABASE=>
```

The `DATABASE=>` prompt means we''re good to go! If you don''t see this, look for errors in your command and contact an instructor for help.

~~~ {.warning}
If you are using Windows and the `heroku pg:psql` command never displays the `DATABASE=>` prompt, try running the command using the built-in Command Prompt.

If this works, you can still run all of your other terminal commands in Git Bash, but any `heroku pg:psql` commands will not to run in the Windows Command Prompt. 😢
~~~

Now we can start running DDL and SQL! Let''s start with the DDL to create our `product` table. The command will run when `Enter` is pressed after a `;`. When all goes well, we''ll see this remarkable output:

``` {.output}
CREATE TABLE
```

Yep, when a DDL command runs successfully, all we get is the name of the statement.

![because why not?](https://i.imgur.com/lAUyr5y.png)

Now let''s try running some SQL. Since our table is empty, let''s insert a row and request that the result be returned to us:

``` {.sql}
insert into product (slug, name, price)
values (''lemonade'', ''Lemonade'', 1)
returning *;
```

This time we see a pretty results table!

``` {.output}
 id |   slug   |   name   | price 
----+----------+----------+-------
  1 | lemonade | Lemonade |  1.00
(1 row)

INSERT 0 1
```

Go ahead and practice some of those other SQL statements. If you need to start over, you can always run `drop table product;`. 😉

~~~ {.note}
#### Disconnecting from the database

To disconnect from the database and exit the Postgres client, type the following command and press `Enter`:

``` {.sh}
\q
```

The database will continue to run and any changes made will stick around!
~~~

## Connecting to database with JavaScript

Wow, you''ve learned a lot about relational databases, DDL, and SQL. Congratulations! 👏

The last bit we have to learn is how to access our database from JavaScript. This will fuse what we just learned with what we already know.

![dragon ball z fusion](https://i.imgur.com/Fg85jYj.png)

### Locating the database

When we create a database in Heroku, it''s running on a computer somewhere on the Internet. If we want to connect to this database -- and we do -- we need a way to tell our code how to find the database.

Do you remember how Heroku tells us which port our code should use by setting the `PORT` environment variable? Heroku also tells us the location of our database by putting it in an environment variable named `DATABASE_URL`. 

In our JavaScript code, when we connect to the database we can access this environment variable with `process.env.DATABASE_URL`.

This works when our code runs on our Heroku hosted site, but if we run the same code on our computer, it won''t work. That''s because Heroku only has control of Heroku''s computers -- it can''t set environment variables on our computer.

If we want to set this environment variable, we''ll need to get the value from Heroku and set it in our `package.json` script before our code runs.

Let''s first revisit the `package.json` file from our API project:

``` {#package.json}
{
  "name": "api-project",
  "version": "1.0.0",
  "scripts": {
    "server": "nodemon server.js"
  },
  "dependencies": {
    "body-parser": "^1.19.0",
    "ejs": "^3.1.2",
    "express": "^4.17.1"
  },
  "devDependencies": {
    "nodemon": "^2.0.3"
  }
}
```

First, let''s install a new development dependency called `cross-env` by running this command:

``` {.sh}
npm install --save-dev cross-env
```

Next, we need to get the connection parameters for our project''s database. We can accomplish this by running the following command:

``` {.sh}
heroku config:get DATABASE_URL
```

The output will be one really long value that looks something like this:

``` {.output}
postgres://iqgfbcyrnjhheb:8a57b88e8c836be3123d3c12f3899ba763428bb243bc3426ef6423aabef3216b@ec2-54-83-27-165.compute-1.amazonaws.com:5432/c42iwf3fyv7f8
```

Yeah... one really long value. 😲

Okay, let''s add this script to our `package.json` file:

``` {#package.json}
"server": "cross-env DATABASE_URL=''<DB_URL>'' nodemon server.js"
```

Replace `<DB_URL>` with that really long value printed by the `heroku config:get DATABASE_URL` command.

There! Now our `server.js` file will be able to connect to our Heroku database. 😎

~~~ {.warning}
In a real application, we should never use the same database for our development server and our hosted site. We would also never put that long database URL inside of our `package.json` file, either, because it allows anyone who can see it to see and change our data.

We do it here because the safer, more legitimate solution is to run separate databases for each environment and use other tools to keep our secrets... well, secret. For now, let''s focus on SQL, DDL, JavaScript, and _one_ database.
~~~

### Using the `pg` package to connect to the database

Now that our code has a way to locate the database, we need to add a client that our JavaScript can use to connect. The client that we will use is `pg`.

Let''s install the client as a project dependency with this `npm` command:

``` {.sh}
npm install --save pg
```

~~~ {.note}
This lesson explains some of the basic features of `pg`. If you want to learn more about it, you can find its documentation at [node-postgres.com](https://node-postgres.com/).
~~~

### Connect to the database with code

With a Postgres client at our disposal, we can finally connect to our database. Put this code at the top of `server.js`:

``` {.js}
const { Pool } = require(''pg'')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === ''production''
    ? { require: true, rejectUnauthorized: false }
    : false
})
```

This code will create a *connection pool* when our server starts. Connection pools make sure we don''t use too many connections all at once. They also let us run SQL in all of our API routes without having to reconnect to the database every time a request is made.

We create the connection pool by giving it the location of the database (`process.env.DATABASE_URL`) and tell it to use SSL on Heroku (production), which means any data sent to or retrieved from the database should be encrypted.

## Getting data from the database

Now that our code is connected to the database, it''s time to give our API a makeover. Let''s do this one route at a time.

### Getting all data

We''ll start by updating the route that returns all of our products to get them from the database. We''re starting with this one because the SQL is simple: we just get everything from the table and send it to the caller.

Here''s what our `GET /products` route looks like _before_ we change it:

``` {.js}
app.get(''/products'', function (request, response) {
  response.json(products)
})
```

And this is what it will look like _after_ we change it to get our products from the database:

``` {.js}
app.get(''/products'', async function (request, response) {
  const client = await pool.connect()
  const result = await client.query(''select * from product'')
  response.json(result.rows)
  client.release()
})
```

Every line has changed except the last one, and that''s okay. The explanations of these changes won''t seem so bad once we take a closer look at each one.

#### Line 1: `async function`

The only change to the first line of our route is the addition of the `async` keyword to our route''s function.

When `async` appears in front of `function`, it means that the function will run in an unknown amount of time. It also means that JavaScript can keep running code that comes _after_ the `async function` while the `async function` finishes doing its thing.

![confused? don''t be](https://i.imgur.com/LgjyKsn.png)

It''s kind of like email. You email your friend a question and you trust that they''ll email you back. Instead of waiting for their answer, you look at some cat pics, eat dinner, and go to bed. Eventually your phone will buzz or you''ll check your email and see that you''re done waiting.

That''s called *asynchronous communication*. JavaScript does it a lot, especially when other computers are involved. Like when we query a database.

Since our route will have to wait for a database connection and wait for some SQL to run, we use `async` to tell JavaScript that it can do other things while it waits for the database.

~~~ {.note}
The `async` keyword isn''t the only way JavaScript knows it doesn''t have to wait for a function to complete before it does other things. Another common way is to use a `Promise`. Promises can be mystifying at first and we''re not covering them in this lesson.

We point this out now because you may see `Promise` referenced in the [node-postgres documentation](https://node-postgres.com/api/pool#-code-pool-connect-gt-promise-lt-pg-client-gt-code-). If you call a function that returns a `Promise`, put the `async` keyword on your route. You may also need to use the `await` keyword to call the function that returns a `Promise`.

We''ll explain how to use the `await` keyword in the next line of this example.
~~~

#### Line 2: `const client = await pool.connect()`

Starting from the right, `pool.connect()` uses our connection pool to get a connection to the database.

The documentation for [`pool.connect()`](https://node-postgres.com/api/pool#-code-pool-connect-gt-promise-lt-pg-client-gt-code-) shows that it returns a `Promise<pg.Client>`. Since it returns a `Promise` it will run asynchronously and when it''s done, we''ll get a `pg.Client`.

That `pg.Client` is the database connection that we need to run our SQL, so we use the `await` keyword when we call `pool.connect()` to tell JavaScript to wait for this asynchronous function to finish before it does anything else.

After we wait for the function to run, we save the connection to a new variable called `client`.

#### Line 3: `const result = await client.query(''select * from product'')`

Finally, some SQL! This is where we use our `client` to run SQL on the database and get the results.

[`client.query`](https://node-postgres.com/api/client#-code-client-query-code-text-optional-values-promise) will run whatever string we pass it on the database and return a `Promise<Result>` when it''s done. Since we plan to send the results of the query to the caller of our API, we''ll use the `await` keyword to wait for the query to finish before running the next line of code.

We want all of our products, so we pass the SQL `''select * from product''` to `client.query`. When running SQL with the node-postgres client, we don''t need a `;` at the end of our statements.

When the query is finished, we save the results to a new variable called `result`.

#### Line 4: `response.json(result.rows)`

This line is very similar to the original. The [`result`](https://node-postgres.com/api/result#-code-result-rows-array-lt-any-gt-code-) object that we got from the database has a property named `rows` that contains all of the data from our query.

We pass `result.rows` to `response.json` so whomever called our API will see all of our glorious data.

![glorious](https://thumbs.gfycat.com/UnhappyRipeAfricangoldencat-size_restricted.gif)

#### Line 5: `client.release()`

We''ve got all our data and sent it to the caller, so this last line may seem fairly unimportant, but without it we would very quickly run out of database connections!

The node-postgres client will only use up to 10 connections unless you configure it to use more. If we don''t release our connections when we''re done with them by calling `client.release()`, our API would start misbehaving after about 10 requests.

Let''s just go ahead and make sure we put this line at the end of every single one of our routes.

### Huzzah, we have products!

Now that we''ve updated a route to get our products from the database, let''s fire up our server and see it in action!

Run `npm run server` to start the server. Then use Postman to call `GET /todos` on our API. We should see something like this:

``` {.json}
[
  {
    "id": 1,
    "slug": "lemonade",
    "name": "Lemonade",
    "price": 1
  }
]
```

Okay, this doesn''t look very exciting, but isn''t it cool that this came from a database server from who-knows-where in the world?

### Searching for specific data

Before we start making changes to the routes that change our database, let''s touch up the route to get a single product.

There will be a lot of similarities to our `GET /products` route because the process is very similar:

1. Connect to the database
2. Run a query
3. Send data to the caller
4. Release our connection

There are three special things we should do when looking up a specific product, though:

1. Use `id` instead of `slug`, since `id` will never change
2. Use the `id` parameter in our SQL query
3. Send the product if found, otherwise send a 404 "Not Found" status

Here''s what our new route will look like:

``` {.js}
app.get(''/products/:id'', async function (request, response) {
  const client = await pool.connect()
  const result = await client.query(
    ''select * from product where id = $1'',
    [request.params.id]
  )
  if (result.rows.length === 1) {
    response.json(result.rows[0])
  } else {
    response.status(404).json({
      error: ''product '' + request.params.id + '' not found''
    })
  }
  client.release()
})
```

In the first line, we now use `:id` instead of `:slug`. We make our route `async`, then get a `client` database connection.

#### Query parameters

When we call `client.query`, we''re using it in a slightly different way this time. The SQL that we use looks like this:

``` {.sql}
select * from product where id = $1
```

What''s up with that `$1`? That is called a query parameter and it protects us from people who try to do very bad things to our database. Imagine if we did this instead:

``` {.js}
''select * from product where id = '' + request.params.id
```

For for real `id` values, this solution will work great. However, what if someone calls our API like this:

``` {.txt}
GET /products/1; drop table product;
```

Our code would create a query that looks like this:

``` {.sql}
select * from product where id = 1; drop table product;
```

This would look for some data and then destroy our entire `product` table! 💥

![thank you but no thank you](https://i.imgur.com/nSPAj8d.png)

Query parameters protect us from a lot of dangerous situations like this. By using placeholders like `$1`, `$2`, and `$3` in our queries and then passing the actual values in a separate array, the database client can make sure no harm will come to our database because of bogus values.

The second argument of `client.query()` is an array of values. The first item in the array will replace any `$1` placeholders in the SQL, the second item will replace any `$2` placeholders, and so on.

#### Finding an exact match

After we save the results of our query to the `result` variable, we want to make sure an exact match was found. Since `result.rows` is an array, we can check that the array has exactly one item in it with `result.rows.length === 1`.

If there was one row, we can get it with `result.rows[0]` because the first item in a JavaScript array is always placed at index 0.

If there wasn''t one row returned by our query, we will respond to the caller with a 404 status code, which means the data could not be found.

When we call our API with this new route, we should see something like this:

``` {.json}
{
  "id": 1,
  "slug": "lemonade",
  "name": "Lemonade",
  "price": 1
}
```

## Changing data in the database

Three more routes to go and our API will be completely backed by a database! These three routes also don''t require us to learn anything new -- we just have to use what we know in different ways to make sure the API continues to work as expected.

![you got this](https://i.imgur.com/MTx4HLt.png)

### Creating a new row in a table

Let''s dive into the route to create a new product. Here''s what the route looks like _without_ any database code:

``` {.js}
app.post(''/products'', function (request, response) {
  const name = request.body.name.trim()
  const slug = name.toLowerCase().split('' '').join(''-'')
  const price = ''$'' + parseFloat(request.body.price).toFixed(2)
  products[slug] = {
    name: name,
    slug: slug,
    price: price
  }
  response.redirect(''/products/'' + slug)
})
```

There are a few things we need to do differently to put a new product in a database:

1. Remove the `$` from the front of our price because the database only wants numbers
2. Use an `insert into` statement with query parameters to add our product to the database
3. Get the generated `id` from the new row to redirect the caller to the new product

To accomplish #3, we''ll have to use `returning *` at the end of our `insert into`. Here''s what that will look like:

``` {.js}
app.post(''/todos'', async function (request, response) {
  const name = request.body.name.trim()
  const slug = name.toLowerCase().split('' '').join(''-'')
  const price = parseFloat(request.body.price).toFixed(2)

  const client = await pool.connect()
  const result = await client.query(
    ''insert into product (slug, name, price) values ($1, $2, $3) returning *'',
    [slug, name, price]
  )
  const id = result.rows[0].id
  response.redirect(''/products/'' + id)
  client.release()
})
```

It''s not _too_ different from our `GET /products/:id` route. In fact, if we wanted to, we could skip calling `response.redirect()` and return the entire new product:

``` {.js}
app.post(''/todos'', async function (request, response) {
  const name = request.body.name.trim()
  const slug = name.toLowerCase().split('' '').join(''-'')
  const price = parseFloat(request.body.price).toFixed(2)

  const client = await pool.connect()
  const result = await client.query(
    ''insert into product (slug, name, price) values ($1, $2, $3) returning *'',
    [slug, name, price]
  )
  response.json(result.rows[0])
  client.release()
})
```

### Updating an existing row in a table

The route to update an existing product will probably require the most changes because we can only update a row if we know it exists. That means we''ll need to first get the product we want to update from the database.

After we look up the existing product, we''ll see what the caller sent to us and change those properties. Then we''ll call `update` in the database for that product. Like we did with our `insert into`, we can use `returning *` on our update to get the result of our change and send that back to the caller.

If that sounds tedious, you''re right, it is. Fortunately our products only have a few properties, and we''re all stars so we''ve got this:

``` {.js}
app.put(''/products/:id'', async function (request, response) {
  const client = await pool.connect()
  const result = await client.query(
    ''select * from product where id = $1'',
    [request.params.id]
  )
  if (result.rows.length > 0) {
    const product = result.rows[0]
    if (request.body.name !== undefined) {
      product.name = request.body.name.trim()
      product.slug = product.name.toLowerCase().split('' '').join(''-'')
    }
    if (request.body.price !== undefined) {
      product.price = parseFloat(request.body.price).toFixed(2)
    }
    result = await client.query(
      ''update product set slug = $2, name = $3, price = $4 where id = $1 returning *'',
      [
        product.id,
        product.slug,
        product.name,
        product.price
      ]
    )
    response.json(result.rows[0])
  } else {
    response.status(404).json({
      error: ''product '' + request.params.id + '' not found''
    })
  }
  client.release()
})
```

Phew, that''s a lot of code! If we wanted to change the behavior of our API, we could require that callers send both a `name` and `price` when updating a product. If the caller does not send us both, we can send a 400 "Bad Request" status so they can change their ways. 😉

Here''s what our update route would look like if we require `name` and `price`:

``` {.js}
app.put(''/products/:id'', async function (request, response) {
  if (
    request.body.name === undefined ||
    request.body.price === undefined
  ) {
    response.status(400).json({
      error: ''name and price are required''
    })
    return
  }

  const id = request.params.id
  const name = request.body.name.trim()
  const slug = name.toLowerCase().split('' '').join(''-'')
  const price = parseFloat(request.body.price).toFixed(2)

  const client = await pool.connect()
  const result = await client.query(
    ''update product set slug = $2, name = $3, price = $4 where id = $1 returning *'',
    [id, slug, name, price]
  )
  if (result.rows.length === 1) {
    response.json(result.rows[0])
  } else {
    response.status(404).json({
      error: ''product '' + request.params.id + '' not found''
    })
  }
  client.release()
})
```

Okay so this way is only 2 fewer lines of code, but we only had to write one SQL statement. Either approach is fine. Feel free to pick which one you like best or fits the requirements for your API. The most important thing is to make sure the caller knows how your API works.

### Deleting a row from a table

Oh look, there''s a light at the end of this tunnel: it''s our last route!! 😱

Given the way our API works, if we want to delete a product we will need to first find the product to make sure it exists (and if not, tell the caller the product wasn''t found). Then we''ll delete the product and send the caller an updated list of all products.

Let''s approach the code like this:

``` {.js}
app.delete(''/products/:id'', async function (request, response) {
  const client = await pool.connect()
  const result = await client.query(
    ''select * from product where id = $1'',
    [request.params.id]
  )
  if (result.rows.length > 0) {
    await client.query(
      ''delete from product where id = $1'',
      [request.params.id]
    )
    response.redirect(''/products'')
  } else {
    response.status(404).json({
      error: ''product '' + request.params.id + '' not found''
    })
  }
  client.release()
})
```

This uses a `select` statement to look up the product. If it exists, we use a similar `delete` statement to remove it. We don''t save the result of the `delete` because we don''t actually need the results. We just redirect the caller to `/todos` so they get the current list of products.

### API + Database = 🚀

Our API is now completely hooked into a database! If we change our products and restart our server, our menu won''t be reset. We also have some great new SQL skills to take to other jobs (not that our lemonade stand business is going anywhere). 😉

![mission complete](https://i.imgur.com/2UDpvPs.png)
', NULL, NULL, 'Update your todo list API to use a relational database', 'Heroku', 11);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (212, 'html-terminal-and-git', 'Use the terminal, Git, and GitHub to manage and publish websites', 2, '## What we''ll be covering

Welcome! You''re publishing a website today, using the actual tools of professional web developers. That mostly means learning the workflow, some new vocabulary, and installing new programs.

It''s actually a lot like picking up your first musical instrument: you can''t play anything too exciting at first and may even feel slightly overwhelmed. This is normal. You might encounter a few errors and that''s actually normal too. If you start to feel anxious, just stop and take a deep breath (seriously), then ask a question - either to Google or to an instructor. We promise it''ll be OK. Professionals get stuck and ask for help too.

And remember, by the end you''ll have built something from scratch that was pushed out to the entire world from your freakin'' fingertips - for free.

![World in the palm of your hand](https://i.imgur.com/flYGMgd.jpg)

To accomplish all this, we''ll be installing and learning the basics of the following tools:

1. Terminal

  * Navigate folders
  * Launch programs

2. Git / GitHub

  * Track code changes
  * Share code with other developers
  * Publish code online

## What''s the terminal?

The *terminal* (a.k.a. the *command line*) looks kind of like this:

![Terminal](https://i.imgur.com/otpEpDd.png)

It''s usually a dark window with light-colored text, like above. You type *commands*, press enter, then something happens. Sounds simple, but there''s _a lot_ of power here. Just today, we''ll use it to:

* Navigate through folders
* Install free developer tools
* Publish and update websites for free
* Share your code with other developers

And the best part is, all of this takes just seconds once you learn the right commands. The terminal automates common, repetitive tasks so that you can focus on the fun part of development: building stuff.

### Running a terminal

If you''re on macOS or Ubuntu, then congrats! You have a suitable terminal already installed. Find the program called "Terminal" and open it up.

If you''re on Windows, download [Git Bash](https://git-scm.com/download/win), go through the install (choose the default option at every step), then run the program.

## Asking "Where am I?" in the terminal

Just like Finder on macOS or File Explorer on Windows, you can use the terminal to browse the files and folders on your computer. We''ll introduce 3 basic commands to help you do this, then play a game to practice.

### `pwd`

The first command is `pwd`, which stands for *Print Working Directory*. What does that mean? Let''s break it down:

* *Print*: In the world of code, "print" often has a slightly different meaning. Instead of printing to a piece of paper, it means _show on the screen_.

* *Directory*: Just another word for _folder_.

* *Working Directory*: The directory you''re currently in, which is important because commands often work differently in different folders. For example, if you run a command to publish a website, you want to be in the same folder as the files for that website.

Now switch over to your terminal, type the `pwd` command, press enter, and watch what happens. You should see something like this:

``` {.output}
/Users/your-username
```

That''s the *path* of the current directory. It says you''re in the `your-username` folder, which itself is inside the `Users` folder. That can be a little tough to wrap your mind around, so let''s look at a visual example. If `pwd` printed:

``` {.output}
/Users/fritzc/projects/code/coursework
```

The equivalent in a visual file browser like Finder would be:

![Folder](https://i.imgur.com/fD14T13.png)

So `pwd` basically asks, "Exactly which folder am I working in?", and the path it prints shows you the folders you would open to get there from your root folder.

### `ls`

Once you know where you are, you may want to look around. You can do this with the `ls` command, which is short for "list files and directories". You may be thinking, "What? Why not just type `list`? Why make things complicated?" The unfortunate answer is: programmers often overlook simple solutions in favor of more clever (but complicated) ones.

![Over-complicated solution](https://i.imgur.com/zQleGYg.png)

Now enter the `ls` command in your terminal. The exact directories you see will be different depending on your OS and computer, but it should look something like this:

``` {.output}
Applications  Documents  Downloads  Library  filename.ext
```

## Navigating folders in the terminal

*Navigating* in this context means changing/moving to a different working directory. The command for this is `cd`. Can you guess what it stands for? It''s _change directory_. This command is a little different from the previous ones in that it takes an *argument*.

![Wrong kind of argument](https://i.imgur.com/r5vrLwl.jpg)

No, not that kind of argument. In this context, "argument" means a piece of information you give to the command. For `cd`, that piece of information is where you''d like to go. For example, if `ls` showed you  there was a `projects` directory inside the current directory, you could enter:

``` {.sh}
cd projects
```

And it would take you there. You could confirm this with `pwd`, which should print something like:

``` {.output}
/Users/your-username/projects
```

~~~ {.warning}
<blockquote>
  "Computers are like Old Testament gods; lots of rules and no mercy."
  <br>- <em>Joseph Campbell</em>
</blockquote>

Not only is spelling very important in programming, but so is *capitalization*. That means if you have a directory named `projects` and try to navigate into it with `cd Projects` (capital `P`), you might get an error:

``` {.output}
cd: no such file or directory: Projects
```

There''s one more important note about terminal arguments: they''re separated by spaces. That poses a small problem when you also have files or folders with spaces in their names. For example, let''s say you have a folder called `Cat Pictures`. If you try to run:

``` {.sh}
cd Cat Pictures
```

You''ll probably get a confusing error like:

``` {.output}
cd: string not in pwd: Cat
```

To get around this, you can put a backslash (`\\`) before the space to tell the terminal, "No, but like seriously - there''s a space in this argument." For example:

``` {.sh}
cd Cat\ Pictures
```

And that should work perfectly! As you can see, it''s important to pay attention to the little details in the world of code.
~~~

Now it''s your turn. Switch to your terminal now and try navigating to a different directory:

1. Use `ls` to see the files and directories in the working directory
2. Use `cd name-of-directory` to change into a different working directory
3. Use `pwd` to confirm that your working directory has changed

### Navigating up (to parent directories)

If you''re in `/Users/your-username/projects`, navigating "up" would mean changing to the parent directory: `/Users/your-username`. With `cd`, you can move up with two dots:

``` {.sh}
cd ..
```

This is especially useful with more complex directory structures, like this:

![Complex directory structure](https://i.imgur.com/ZZWEQ0a.png)

Let''s say you''re currently in `coursework` and you want to move to `vacation`. You could move up 3 directories, then into `photos`, then into `vacation` with a single command:

``` {.sh}
cd ../../../photos/vacation
```

### Practice

Ready to test your terminal navigation skills? Try scoring 20 points in [this little terminal game](http://shaky-adjustment.surge.sh/) before moving on.

## Introducing Git

Now that we can navigate around the terminal, it''s time to _git_ started with Git. Get it? Sorry, we promise that will be the last Git pun. So what is Git exactly?

Git is a *distributed version control system*. You''ll learn more about exactly what that means as you use it, but for now, know that it helps you:

* Keep track of changes in your code
* Look back in time and identify the source of bugs
* Collaborate with other developers
* Back up your code to external sources
* Contribute to open source projects
* Push your websites to servers that will host themes

That''s a lot of power in a single tool! Before we can learn to use it though, we have to install it:

* *macOS*

  1. [Install Homebrew](http://brew.sh/)
  2. Install Git and its login manager with these three terminal commands:

    ``` {.sh}
    brew install git
    brew tap microsoft/git
    brew install --cask git-credential-manager-core
    ```
  3. Restart your terminal

* *Windows*

  1. Git is already included with Git Bash! Nothing to do here. 🤘

* *Ubuntu*

  1. Install Git with `sudo apt-get install git` in the terminal
  2. [Install Git Credential Manager Core](https://github.com/microsoft/Git-Credential-Manager-Core#linux-install-instructions) by following the instructions for your specific distribution
  3. Restart your terminal
  
~~~ {.warning}
If the latest version of Git is not installed on your computer, you may be unable to access your projects or be asked for your password in the terminal a lot. Here''s how you can check your Git version:

``` {.sh}
git --version
```

The output will look something like this:

``` {.output}
git version 2.30.1
```

If the version is not 2.29 or higher then upgrade Git:

* *macOS*

  Run `brew upgrade git` in the terminal

* *Windows*

  Download and install the latest [Git Bash](https://git-scm.com/download/win)

* *Ubuntu*

  Reinstall Git with the following three terminal commands:
  
  ``` {.sh}
  sudo add-apt-repository ppa:git-core/ppa
  sudo apt update
  sudo apt install git
  ```
~~~

### Using Git with GitHub

GitHub, as you may have guessed from the name, is a "hub" for Git projects. It''s a free service that gives you a place to store your code projects and collaborate with others. Each project is stored in a what GitHub calls a *repository*.

For lessons like this one, we''ll even use GitHub to *host* our projects online for free, so that anyone in the world can view them as a real website, rather than raw code.

If you don''t already have a GitHub account, [create one now](https://github.com/join). It''s free and just takes a few minutes. When you''re done, *confirm your email address* by clicking the link in the email GitHub sends to you after signup.

Before you start your first project, you will also need the GitHub Student Developer Pack. This will allow you to create repositories that only you and your instructors can see. It also comes with a lot of other tools for creating pretty much any kind of software you can imagine &mdash; and it''s free for students! 😍

### If you signed up for GitHub with your `.edu` email address:

1. Confirm your email address.
2. Go to [education.github.com/pack](https://education.github.com/pack) and follow the instructions.

### If you signed up for GitHub with some other email address:

1. Do NOT create a new Github account.
2. Add your `.edu` email address ([instructions](https://help.github.com/articles/adding-an-email-address-to-your-github-account/)).
3. Confirm your email address.
4. Go to [education.github.com/pack](https://education.github.com/pack) and follow the instructions.

Finally, connect your GitHub account to this website with the *Connect GitHub* link in the navbar. This will allow us to track your progress as you complete projects for the course.

~~~ {.note}
When you attempt to access a project using Git, you may be told that you need to configure your name and email.

Run the following commands in the terminal to do this, making sure to replace _Your Name_ and _name@email.com_ with your actual name and email used to sign up for GitHub:

``` {.sh}
git config --global user.name "Your Name"
git config --global user.email "name@email.com"
```

It''s okay if you don''t remember how to do this. Git will show you the commands the next time it needs your info. 😉
~~~

## Your first project: Creating a directory for your projects

For this first project, we''ll walk you through what submitting a project for this course looks like. Along the way, you''ll learn more about both the terminal and Git. Before we go any further though, do you have a directory on your computer where you can keep all your code projects? If you don''t, let''s create one now. We recommend doing this through the terminal for practice:

``` {.sh}
# NOTE:
#
# In the terminal, anything after a "#" is a comment.
# That means it doesn''t do anything - it''s just for
# people reading the code so that they can better
# understand what it does. This text itself is a
# comment. Woah, so meta!
#
# OK, now back to creating your projects folder:

# 1) Make sure you''re where you want the directory
#    for your code projects to be. If you''re not sure,
#    you can navigate to your home directory (e.g.
#    /Users/your-username) with:
cd ~

# 2) Use the mkdir command to "make" a new
#    "directory" with the name you provide. Below,
#    we''re just calling this new directory "code":
mkdir code
```

## Your first project: Starting a project

When you''re ready to start coding, the first step will always be to create a GitHub repository for it with the "Start Project" button under the *Project* tab near the top of the page in this lesson. Click it now.

Great job! As you may notice, the instructions under the Project tab updated automatically once the repository was created. You can see the repository that was just created by clicking on the "GitHub Repository" button that''s now available.

Now that we have a place to store and collaborate on your code, instructions will appear to *git clone* the repository to your computer. Cloning creates a new project directory with a hidden `.git` directory inside it. This is where Git stores information about your project, including where it originated, making it easy to push your code back up to GitHub after you''ve made changes.

``` {.sh}
# If you''re not already there, navigate to the
# projects directory you just created.
cd PATH/TO/YOUR/PROJECTS/DIRECTORY
```

Now follow the instructions to clone your repository, then enter `ls` to confirm that it worked. You should see a new directory that might look something like this:

``` {.output}
MI-449-html-terminal-and-git
```

~~~ {.note}
The first time you run a *git clone* command in the terminal, you may be prompted to login to GitHub in your browser. Once you do that, you should not be asked to login to GitHub again.

If you do have to login to GitHub every time you run a `git` command in the terminal, follow the instructions on page 5 of this lesson to make sure you are using the latest version of Git and upgrade if you are not. Contact your instructor if you get stuck.
~~~

## Your first project: Creating and editing files

In later lessons, we''ll use a __code editor__ for projects, which includes many tools to make writing code easier. In this first lesson however, we''re not writing real code yet, so we''ll keep things simple and strengthen our terminal skills instead.

### Saving time with tab completion

Before starting work on the project, we need to `cd` into the project directory that was just created with the `git clone` command. There''s just one problem: the project directory names can be really long! And we''re lazy. Who''s got time to carefully type that whole thing?

Meet your new friend, *tab completion*. For many terminal commands, pressing the tab key can complete commands for you. For example, if you type in `cd`, then part of the directory name you want to move into, like this:

``` {.sh}
cd MI
```

_Then_ you press the `Tab` key and if there''s only one directory that matches, the terminal will automatically fill out the rest. Go ahead and try it, then press Enter to run that tab-completed command.

### Make a branch for your file changes

The last bit of prep-work we have to do for our project is to make a *branch* to save our files.

Branches are a powerful feature of Git that allow us to have several different copies of our code. There are many uses for this, but in our case it allows us to have a _draft_ copy and a _published_ copy, just like in many blogging systems.

In our case, the draft copy is the `main` branch. To create the branch, run this command from the project directory:

``` {.sh}
git checkout -b main
```

This command will create the `main` branch and tell Git to use it to track any changes we make.

Since it is the first branch created for the project, it will also become the default branch for any changes we will make. In other words, we only need to create the `main` branch once before we start working on a project.

~~~ {.note}
Before October 1st 2020, GitHub named its default branches `master` instead of `main`. Other Git websites such as GitLab and Bitbucket are also planning to or have already started using less offensive default branch names.

To find out which branch you are using after cloning a repository (or anytime really), run `git status` to see the active branch.

If you see a message like `error: src refspec main does not match any` then you may be attempting to use the wrong default branch.
~~~

### Creating a file with `touch`

Now that we''re in the right directory and have created a branch to work in, let''s create a new file called `index.html`. We''ll learn more about this file later, but for now, just know that it''s a foundation for a lot of web development projects.

To create the file, we can use the *`touch`* command. Yeah, it''s a weird name, but it''s simple to use. Just type `touch`, then the name of the file you want to create:

``` {.sh}
# The touch command creates a new file with the name
# you provide - and remember, capitalization is
# important! Don''t try to be fancy by capitalizing
# anything.
touch index.html
```

You can confirm that the file was created correctly with `ls`. If you made a typo, for example naming the file `inex.hmtl` by mistake, you can fix it with the `mv` (i.e. "move") command:

``` {.sh}
# Not just good for moving, but also renaming!
mv inex.hmtl index.html
```

### Opening a text file from the terminal

Now let''s open up the file in a basic text editor:

``` {.sh}
# macOS
open -t index.html

# Windows
notepad index.html

# Ubuntu
gedit index.html
```

Type in your favorite knock-knock joke, save, then quit the text editor. Excellent! You just built a website. It''s not a _great_ website, but hey, it''s a start.

## Your first project: Checking your work in the browser

Before going any further, it''s good to check your work in a web browser, to make sure it actually looks and works like you want it to. In our case, we just want to make sure that our knock-knock joke appears on the page.

Now a slight warning. It''ll probably look ugly and appear all on one line, even if you had multiple lines in your file. Don''t worry about that for now. Those are fancy features we''ll learn about later. For now, just open the project directory in your visual file explorer:

``` {.sh}
# Note: Just like we learned that ".." means the
#       parent directory in the terminal, the
#       current directory also has a shortcut:
#       "." (a single dot)

# macOS
open .

# Windows
explorer .

# Ubuntu
xdg-open .
```

Then double-click on the `index.html` file to open it in your default browser. Hopefully, you should see your joke!

## Your first project: Tracking changes with Git

When people first learn to ride a bike, they see other people do it and the mechanics are explained to them, but it still takes a while to really _get it_.

At first, it seems like the bike should just fall over right away. And the first time you try, that''s certainly what happens. People tell you to just keep trying and trust it, but you''re scared. After enough practice though, there''s suddenly a moment when you realize it''s happening. You''re riding a bike. It''s not falling over. You finally understand what to do.

It takes a little while longer to wrap your mind around steering, but eventually, you experience a similar eureka moment. Some people have this again when they learn to ride with no hands. Then others take it a step further with unicycles.

Learning to use Git is similar. It''ll feel very strange at first. This is normal! Everyone goes through it. And you''ll probably never reach the unicycle level. Even many professional programmers don''t make it to riding with no hands. They simply don''t need it for their work.

So in this lesson, we''re going to keep our hands on the seat to keep you upright. We''ll go over a lot of new information, but you''re not expected to understand everything right away. Over time, you''ll do more on your own and it''ll start to feel more natural. If you keep at it and continue asking questions, those eureka moments will find you and you''ll start to see the matrix.

![See the matrix](https://i.imgur.com/3RCixk0.jpg)

### Git is like loading a truck

Now that you''ve developed a simple feature, it''s time to track the changes. Git actually works a lot like loading a truck with boxes, where each box is a changed file. There are three steps:

1. Sort through which boxes go in the truck
2. Move those boxes into the truck and lock the door
3. Send the driver off to deliver the shipment

In the language of Git, these three stages are respectively called:

1. Stage
2. Commit
3. Push

Let''s start with the first two.

### 1. Stage

Pick which files you want to include in the next commit with `git add`. You can add files to be staged one at a time:

``` {.sh}
git add index.html
```

Or add _all_ the files in the current directory:

``` {.sh}
git add -A .
```

The `-A` allows you to stage not only added and updated files, but also deleted files. You may remember from earlier, the `.` refers to the current directory. You can also leave out the `.` and the command will also add all files in the current directory.

### 2. Commit

"Lock in" the changes in the staged files, with a message describing what you did:

``` {.sh}
git commit -m "create index.html with a knock-knock joke"
```

The `-m` is used to add the required commit message, which is surrounded by quotes.

### Troubleshooting with `git status`

There will be times when you''ll forget which commands you''ve run or you''ll make a mistake. Both are natural. When it happens, just run `git status`. This command gives you more information about what''s going on in your project, including which files (if any) are:

* edited, but not yet tracked/staged (Git calls a file "untracked" if it''s new)
* staged (i.e. ready to be committed)

You''ll also sometimes see tips, describing commands to undo something if you''ve made a mistake. Very useful! Now let''s dive into an example. In this project, running `git status` directly after creating `index.html` would show you that it''s untracked:

![git status: Untracked files](https://i.imgur.com/r0xzFHt.png)

Then after running `git add index.html`, you''d see that it was staged to be committed:

![git status: Changes to be committed](https://i.imgur.com/5fmI4NF.png)

And finally after the commit, you''d see that it''s all clear. There are no changes in the project that haven''t already been committed:

![git status: No changes to be committed](https://i.imgur.com/w2vFyzT.png)

Of course, there will still probably be times when you have an oh-dear-what-on-Earth-have-I-done moment. If that happens, don''t worry. You''ll get through it!

If you see an error message, read what it says. That might sound obvious, but it can be easy to forget when you''re feeling stressed. If you don''t understand what the message is saying, copy it into Google. Chances are, someone else has had the same problem and found a solution. You''ll find a lot of good information on [Stack Overflow](https://stackoverflow.com), [GitHub](https://github.com), as well as the blogs of other programmers.

Sometimes though, you''ll run into a really weird issue. Or you''ll be missing one vital piece of information that keeps you from asking the right question. In those cases, you can ask a more experienced classmate or an instructor and they''ll help you bridge the gap.

~~~ {.danger}
You may run into an error that causes so much trouble that you think it would be easier to just start over. If you start to think this, talk to an instructor before you do anything else! They may have seen the same problem before or may know a way to undo your recent changes without undoing all of your changes.

There is almost never a situation at a job or on a bigger project where you can delete a whole repository and start from scratch. And who''s to say the problem won''t happen again if you start over and follow the same steps as before?

If you''re still tempted to start over, *don''t delete your repository on GitHub*. Instead, click the big scary "Reset Project" button on the Project tab. This will permanently remove your repository from GitHub, reset the project on this website, and leave any files on your computer alone.
~~~

## Your first project: Pushing your changes to GitHub

Whenever we commit changes, we have to push them back up to GitHub. We can do this with the command:

``` {.sh}
git push origin main
```

~~~ {.note}
The first time you run this command, you may be asked to login. Use the browser to login to GitHub using your username and password. After you''ve done this, you shouldn''t need to do it again.
~~~

To better understand the `origin main` part of this command, we need to learn about *remotes*. Remotes are simply links to other copies of your project.

When we cloned the repository from GitHub earlier, it saved a link to your GitHub repository. Since GitHub is where the project _originated_, Git calls this remote `origin`.

If you run `git remote -v`, you can see a list of all your remotes. Right now, it should look something like below, with the same link appearing twice:

``` {.output}
origin  https://github.com/your-github-username/MI-449-html-terminal-and-git.git (fetch)
origin  https://github.com/your-github-username/MI-449-html-terminal-and-git.git (push)
```

So `origin` is the remote we''re pushing to and `main` is the name of our branch. When we run `git push origin main`, we are uploading a copy of our `main` branch to GitHub.

### Publishing your live website

To publish our latest committed draft on `main`, we can push up our changes to a `gh-pages` branch. This branch, which is short for _GitHub Pages_, has special powers on GitHub. Any simple website pushed there will automatically be published to:

``` {.output}
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPOSITORY-NAME
```

Now to actually push the changes in our `main` branch to the `gh-pages` branch (i.e. publish our latest draft), we can run the same command with `main:gh-pages` instead of just `main`, like so:

``` {.sh}
git push origin main:gh-pages
```

In `main:gh-pages`, the branch we''re pushing _from_ is before the colon and the branch we''re pushing _to_ is after it.

GitHub Pages even allows you to use custom domains you own. Do you realize what that means? Infinite backups and free hosting for those that wield the power of Git! Cue _Lord of the Rings_ reference:

![Frodo beholding the power of the ring](https://i.imgur.com/L0qZZHh.jpg)

## Your first project: Collaborating on GitHub issues

On any GitHub repository, you''ll find a tab labeled *Issues*. This is where other coders can bring up bugs they found, suggest improvements, and request new features. This is where open source coders collaborate and plan the future.

In this course, you''ll use GitHub''s issues to receive feedback from and communicate with instructors. You''ll talk about the same things professionals do: bugs, improvements, and new features. Working with instructors to get your project approved will typically happen in 4 steps:

1. *Submit*: Once you''ve started work on your project and pushed some code to GitHub, you''ll be provided a button to submit the project for review. This will automatically fill out the title and description for a new issue, with:

  * An "at-mention" to notify your instructor through GitHub (e.g. `@professor_x`)
  * A link to the hosted version of your website
  * A list of the criteria your project should fulfill

  There will also be room at the bottom of the description for you to leave your own comments before creating the issue.

2. <p>*Receive Feedback*: If an instructor wants you to make improvements to a project before they approve it, they''ll leave you comments describing how your code could be even better. You may even learn some new tricks beyond what''s in the lesson!</p>

3. *Update your code*: Once you make some changes, you''ll need to:

  1. Commit them and push to GitHub again
  2. Comment on the issue to let your instructor know the code is ready for another look

4. <p>*Get approved*: Finally, when the instructor feels you''ve met the criteria in the project and have been pushed far enough, they''ll leave you a "ship-it squirrel".</p>

![The ship-it squirrel](https://i.imgur.com/H8gzPWl.jpg)

Don''t laugh. The ship-it squirrel is very serious business. On GitHub, it means your code is ready to ship (i.e. good enough to be shared with the world). Here, it means you''ve received full credit for that project. You may have more questions at this point:

* Why a squirrel?
* Why is she wearing a fedora and... what might be a bathrobe?
* What does any of this have to do with shipping things?

All excellent questions. You could Google it and probably find some answers, but in the minds of most programmers, it''s just one of those weird Internet things at this point. And as coders, it''s important to proudly uphold the barely-years-old traditions of Internet memes.

That''s all you need to know about completing projects. Congratulations, cadet. You''ve made it through basic training.
', NULL, '-K_AqRX8VByvEk_u9ftI', 'Host an extremely simple HTML file', 'GitHub Pages', 4);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (222, 'js-package-json-intro', 'Use package.json to build projects and manage tools', 3, '## The trouble with managing tools by hand

The way we''ve been using tools like `sass` and `surge` has been tedious to say the least. First we install each tool, one at a time. Then we type out each command every time we need to use it (assuming we remember how). 😬

In a terminal it may only take a moment to enter a command, but installing one tool at a time is so monotonous. And typing the same command over and over? It''s maddening, not to mention it deprives us of time that could spend writing more code.

There has to be a better way!

### Introducing `package.json`

Fortunately, there is. The creators of Node and NPM came up with a way to keep track of all sorts of information about your project -- including tools and common commands -- using a special file named `package.json`.

For this lesson, let''s pick up where we left off in our Sass project.  You can follow along in your actual Sass project, or copy the `source` directory and `index.html` to a new project directory.

We''ll start by creating a bare-minimum `package.json` file that looks like this:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0"
}
```

This file must be named exactly `package.json` (all lowercase letters) and it needs to exist at the root of our project.

The `.json` extension indicates that this file has to be formatted using JavaScript Object Notation, or JSON for short. We touched on JSON briefly in the [JavaScript Objects](../js-objects) lesson. The main difference between JSON and JavaScript objects is that you _must_ use double quotes (`""`) around any string in JSON, regardless of whether it is a property or a value!

~~~ {.note}
If you want to learn more about JSON, we recommend reading the [W3Schools JSON introduction](https://www.w3schools.com/js/js_json_intro.asp).
~~~

In the example above, we can see that `package.json` has two required fields:

#### `name`

No surprise here, `name` is the name of your project. It should be short and descriptive. `name` should only contain lowercase letters, numbers, and dashes. Don''t use spaces and other punctuation.

#### `version`

The `version` field is typically used to convey what kind of changes have been made to a project. It''s a string formatted as `x.x.x`, where each `x` is a whole number. We won''t be tracking the project version in this lesson, but since it''s required, let''s set it to `1.0.0` and call it good.

## Manage project dependencies with NPM

We now have a `package.json` file that describes the name and version of our project. That''s great, but that''s not one of the problems we''re trying to solve. What we really want is an easier way to keep track of and install _all_ of our project''s tools.

In order to do that, we need a *package manager*. A package manager lets us install project dependencies, run custom terminal commands, and interact with `package.json`. 

~~~ {.note}
A *dependency* is any piece of software that a project needs in order to run. They come in two flavors: dev dependencies and runtime dependencies.

*Dev dependencies* are tools that are needed _before_ a project can run. Sass is a dev dependency because you use it to compile your SCSS files into CSS _before_ your website will work.

*Runtime dependencies* are software that a project needs _while_ it is running. Bootstrap is a runtime dependency because its files are needed at the time someone tries to view your website. Runtime dependencies are much more common in server-side development.
~~~

Since we want a better way to install tools such as `live-server` and `sass`, we''ll focus on dev dependencies in this lesson while keeping in mind that runtime dependencies aren''t much different.

We''ve already been using `npm`, the package manager that comes with Node, so let''s take a closer look at this tool and how it can help us level up our projects.

### Installing dependencies with `npm`

In the [Sass lesson](../css-sass-intro) we used two tools while we were coding: `live-server` and `sass`. In order to run these dev dependencies from a terminal, we installed them _globally_.

Without any instructions, anyone who wanted to work on that project had no way to know that `live-server` and `sass` needed to be installed first.

Of course, we could provide instructions along with our project, but `npm` and `package.json` do us one better. They make it easy not only for us to declare our project''s dev dependencies, but also for other developers to install them.

Before we do anything, let''s see what what we''ve already put in our `package.json` file:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0"
}
```

Just a name and a version. Now let''s use `npm` to install our two dev dependencies _locally_ (i.e. just for our project). Make sure you `cd` to your project directory before running this command:

``` {.sh}
npm install --save-dev live-server sass
```

This command does a few things:

1. Installs `live-server` and `sass` in a new directory named `node_modules`
2. Updates `package.json` to show that the project depends on both tools
3. Creates or updates `package-lock.json` file to include the exact versions of all dependencies needed by the installed tools

Let''s take a look at `package.json` again:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0",
  "devDependencies": {
    "live-server": "^1.2.1",
    "sass": "^1.44.0"
  }
}
```

There''s a new field named `devDependencies` that lists `live-server` and `sass`! Not only that, but we can also see which version of each dependency is needed.

Now if another developer wants to make changes to this project, they could look at `package.json` to see what they need to install, but -- and here''s the sweet part -- they don''t need to! All they have to do is download the project and run this terminal command:

``` {.sh}
npm install
```

Running `npm install` will automatically install _all_ of a project''s dependencies!

![We''re super happy now!](https://i.imgur.com/tXSo326.jpg)

### `package-lock.json`

When we run commands like `npm install`, a file named `package-lock.json` will be created (or updated if it already exists). This file is how NPM ensures the same version of each dependency is installed on all computers.

It provides additional package information that does not exist in `package.json`, but it isn''t a file you need to open or understand. You _do_ need to make sure this file is checked into version control though!

## Run common commands with NPM

Being able to install our project''s dependencies in one swift command is super convenient, but it kind makes our problem of running really long, hard-to-remember commands even worse.

If we want to run the locally-installed `live-server`, we would need to run our command like this:

``` {.sh}
./node_modules/.bin/live-server
```

Or like this:

``` {.sh}
npx live-server
```

![Are you kidding me?](http://i.imgur.com/hINybsb.png)

No, this isn''t a joke, but our good friend `package.json` offers a solution for this problem too.

### Writing `package.json` scripts

Any frequently used commands or tools that you need to run can also be saved in `package.json` in a field called `scripts`.

If we want to save the command to run `live-server`, we would update `package.json` to look like this:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0",
  "scripts": {
    "server": "live-server"
  },
  "devDependencies": {
    "live-server": "^1.2.1",
    "sass": "^1.44.0"
  }
}
```

You can think of scripts as shortcuts for long commands. In our example, we named our `live-server` command `server`.

Notice how we left out the `./node_modules/.bin/` and `npx` part of the command? That''s because `npm` will automatically look for commands and other dependencies inside `node_modules` for us!

Now we can use NPM to run our script like this:

``` {.sh}
npm run server
```

This will run `live-server` just like we had typed it by hand.

~~~ {.note}
#### How to stop a command

If you want to stop a command in the terminal, including a long-running or never-ending script, press `Ctrl`+`C`.
~~~

Now let''s add the long `sass` command:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0",
  "scripts": {
    "server": "live-server",
    "sass-watch": "sass source/scss:compiled/css --style=compressed --watch"
  },
  "devDependencies": {
    "live-server": "^1.2.1",
    "sass": "^1.44.0"
  }
}
```

We no longer have to type that impossible-to-remember command. Instead, we can just run:

``` {.sh}
npm run sass-watch
```

Is your brain sighing with relief? I know mine is! 😌

## Run multiple scripts with `npm-run-all`

In our Sass project, it was a little annoying to run `sass` before running `live-server` to look at our changes. Wouldn''t it be nice if they could run at the same time so we can change a Sass file, save it, then switch to our browser and immediately see the result?

![We have the technology](http://i.imgur.com/hrVxTvz.png)

Indeed. It would be nice, and we _do_ have the technology.

Scratch that. We have the know-how and the technology exists, but we have to install it first:

``` {.sh}
npm install --save-dev npm-run-all
```

Okay, _now_ we have the technology!

This new tool that we installed -- and saved as a dev dependency -- gives us new commands that can run other scripts. We can choose to either run our other scripts sequentially (one at a time) or in parallel (all at the same time).

### Running multiple scripts at the same time

Our goal is to run two scripts -- `server` and `sass-watch` -- at the same time so we can change our Sass files and immediately see the results in a web browser without having to run any commands in between.

To run our two scripts in parallel, we can use the `run-p` command (the `p` means "parallel") that was installed with `npm-run-all` in a new script named `dev`:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0",
  "scripts": {
    "server": "live-server",
    "sass-watch": "sass source/scss:compiled/css --style=compressed --watch",
    "dev": "run-p server sass-watch"
  },
  "devDependencies": {
    "live-server": "^1.2.1",
    "sass": "^1.44.0",
    "npm-run-all": "^4.1.5"
  }
}
```

Now we can run our new script and it will run `server` and `sass-watch` at the same time:

``` {.sh}
npm run dev
```

As long as `npm run dev` is running, our `sass-watch` script will look for changes to Sass files, compile them, and generate a new source map. At the same time, our `server` script will refresh our web browser window when it finds changes to any of our project files.

`npm-run-all` also supports *wildcards* so we don''t have to spell out each and every script we want to run when we use `npm run dev`.

A wildcard is a special character that will match any other characters in its place. For example, `dev:*` will match `dev:sass`, but it will not match `sass-watch`.

Let''s rename our `server` script to `dev:server` and our `sass-watch` script to `dev:sass`. Then we can simplify our `dev` script to `run-p dev:*`:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0",
  "scripts": {
    "dev:server": "live-server",
    "dev:sass": "sass source/scss:compiled/css --style=compressed --watch",
    "dev": "run-p dev:*"
  },
  "devDependencies": {
    "live-server": "^1.2.1",
    "sass": "^1.44.0",
    "npm-run-all": "^4.1.5"
  }
}
```

Running `npm run dev` will work exactly the same as it did before, with two added benefits:

1. It is clear to other coders that scripts beginning with `dev:` are only for development
2. We can add a new tool that runs at the same time as `live-server` and `sass` simply by creating a new script that starts with `dev:`

Before we move on, here''s a little reminder to use `Ctrl`+`C` to stop the `npm` command and anything else it might be running.

### Running scripts one at a time

`npm-run-all` also provides a command named `run-s` (the `s` means "sequential") that allows you to run multiple scripts one after the other.

The important thing to remember with `run-s` is that each script runs in the order it appears in the file, going left to right in the `run-s` command and top to bottom if wildcards are used.

Let''s update our project so it will automatically compile our Sass files and then upload our project to Surge.

First, we need to install Surge and save it as a dev dependency:

``` {.sh}
npm install --save-dev surge
```

Then we need to add three scripts to `package.json`:

1. `build:sass` will compile Sass files but will not wait for more changes
2. `deploy:surge` will upload the project to Surge
3. `deploy` will run `build:sass` and then run `deploy:surge`

The result will look like this:

``` {#package.json}
{
  "name": "sassy-project",
  "version": "1.0.0",
  "scripts": {
    "dev:server": "live-server",
    "dev:sass": "sass source/scss:compiled/css --style=compressed --watch",
    "dev": "run-p dev:*",
    "build:sass": "sass source/scss:compiled/css --style=compressed",
    "deploy:surge": "surge --project . --domain sassy-project.surge.sh",
    "deploy": "run-s build:* deploy:surge"
  },
  "devDependencies": {
    "live-server": "^1.2.1",
    "sass": "^1.44.0",
    "npm-run-all": "^4.1.5",
    "surge": "^0.21.3"
  }
}
```

Whoa, our `package.json` is looking pretty serious now! Just make sure to replace `sassy-project.surge.sh` to the domain _you_ need to deploy to. 😉

Now all it takes to compile our Sass and upload the project to Surge is one easy command:

``` {.sh}
npm run deploy
```

And since we used a wildcard to run our `build:*` scripts, we could easily introduce a new script -- such as linting -- to our build process. Actually, that raises the question: what happens if a script stops running because it ran into an error, like when a linter finds badly formatted CSS?

The answer is the same for both `run-p` and `run-s`: they stop running right away. That means if we use `run-s` to run linters _before_ we upload our project to Surge then our project won''t be uploaded if there are any bad files in our project.

We can use our new scripts to guarantee a valid project exists before we can deploy it! #winning

![High five!](https://i.imgur.com/bQz0AgP.jpg)

## Ignoring files when and where they''re not wanted

They''re not always obvious, but once you notice them, they can''t be _unnoticed_.

&nbsp;&nbsp;&nbsp;&nbsp;The unwanted files...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In GitHub...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;In Surge...

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;They linger.

![Unwanted files, they''re after me!](https://i.imgur.com/0ftajSk.png)

Any files and directory that are automatically generated -- for example, `node_modules` and everything in our `compiled` directory -- don''t belong in your Git repository. Similarly, there are files you _want_ in your Git repository -- like `package.json` -- that don''t belong on Surge.

Why? For one, they take up unnecessary space. In the case of `node_modules`, a _lot_ of space. Uploading unnecessary files takes up time for no good reason.

The mere presence of those unwanted files can also be misleading to other people and the tools we use. For example, we don''t code review the compiled CSS files, and they definitely aren''t linted, which can make your code editor''s linter very upset.

Fortunately, there are ways to tell GitHub and Surge to ignore unwanted files.

### Ignoring files in Git and GitHub

When there are files or directories you want to keep out of your Git repository, you can add their names (one per line) to a special text file named `.gitignore`. This file goes at the root of your project.

~~~ {.warning}
We highly recommend you create your `.gitignore` file _before_ you add any files to your Git repository!

If you try to ignore a file _after_ it''s in your repository, the file won''t be ignored until you remove the file first.

Here''s an example of how to remove `node_modules` from your repository, but not from your computer:

``` {.sh}
git rm -r --cached node_modules
git commit -m ''Removed node_modules''
git push origin main
```

Notice that you don''t run `git add`. If you run `git add` after running `git rm`, you will add the directory again, which isn''t what you want to do! 😆
~~~

For our Sass project, there are two directories we want to exclude from Git: `node_modules` and `compiled`. If we created our `.gitignore` file by hand, it would look like this:

``` {.txt}
node_modules/
compiled/
```

The `/` at the end of each line tells Git to only ignore a `node_modules` or `compiled` directory. If you name a file `compiled`, it won''t be ignored.

You can also use `*` as a wildcard character to ignore files that match a pattern. Here''s what our `.gitignore` would look like if we also wanted to ignore log files that our tools may create as well as `.DS_Store` files that appear on macOS:

``` {.txt}
node_modules/
compiled/

*.log*
*.DS_Store
```

Now any files that contain the characters `.log` in the filename will be kept out of Git. The same goes for files that end with `.DS_Store`.

~~~ {.note}
If you''re unsure which files to ignore when you start a project, [gitignore.io](https://www.gitignore.io/) lets you to enter one or more keywords such as "node" or "macos" and generate a `.gitignore` file.

As you customize your project and introduce new tools, remember to update `.gitignore`. It''s much easier to avoid adding unwanted files than it is to remove them after the fact! 😬
~~~

### Ignoring files in Surge

Sometimes there are files in your Git repository that you don''t want on your hosted site. Looking through our Sass project, we might come up with this list:

* `.gitignore`
* `node_modules`
* `package.json`
* `package-lock.json`

No one viewing our website cares about any of these files, and when even a small `node_modules` directory can be more than 50 MB, we also don''t want to sit around waiting to upload those files.

Luckily, if we upload our files to Surge, any file that starts with a `.` will be ignored. So will `node_modules`. Good job, Surge! 🤜&nbsp;🤛

For everything else, Surge will look in a file named `.surgeignore`. This file works like `.gitignore`: put a file or directory name on a line, use `*` and `/` as you see fit, and those files will not be uploaded.

So we can ignore the remaining to unwanted files -- `package.json` and `package-lock.json` -- by creating a `.surgeignore` file in our project and adding two lines to it:

``` {.txt}
package.json
package-lock.json
```
', NULL, '-Kg-tGc7NOax99AjvZZg', 'Introduce tools to an old web-based game', 'Surge', 4);
INSERT INTO lesson (lesson_id, lesson_key, title, estimated_hours, content, notes, project_key, project_title, project_hosting, version) VALUES (201, 'css-intro', 'Use CSS to change the colors and sizes of elements', 2, '## Rules, selectors, properties, and values

*CSS (Cascading Style Sheets)* are what make the difference between a plain, boring webpage and one that looks attractive and organized. The *cascading* part means it''s a list of rules that can override each other. For example, you might decide you want all paragraphs to have black text, _but_ you want paragraphs with a class of `error` to have white text with a red background instead. You would accomplish this in CSS with:

``` {.css}
p {
  color: black;
}

p.error {
  color: white;
  background-color: red;
}
```

As you can see, this looks quite a bit different from HTML. Breaking it down, we have two CSS *rules*. Each rule looking something like this:

``` {.css}
selector {
  property: value;
}
```

The individual pieces are:

* a *selector*, which _selects_ which element(s) we want to style
* one or more *property*-*value* pairs, which specify _how_ the element(s) should be styled

After each selector, there''s always a pair of *curly braces* (`{` and `}`). Inside of those curly braces:

* each property always ends with a *colon* (`:`)
* each value always ends with a *semicolon* (`;`).

### Selector specificity

When there are two rules that affect the same element, like in our example, the rule with the more specific selector has higher priority. That means this HTML:

``` {.html}
<p>This is a normal paragraph</p>
<p class="error">This is a scary error paragraph!</p>
```

Will appear as:

~~~ {.result}
<p class="css-example-normal">This is a normal paragraph</p>
<style>
p.css-example-normal { color: black; }
p.css-example-error { color: white; background-color: red; }
</style>
<p class="css-example-error">This is a scary error paragraph!</p>
~~~

Since `p.error` (`p` elements with a class of `error`) is more specific than all `p` elements, it overrides the first rule that says all paragraphs should have black text. Even if the rules were in a different order, the result would be the same:

``` {.css}
p.error {
  color: white;
  background-color: red;
}

p {
  color: black;
}
```

The order only matters when two rules have the same specificity. For example, in:

``` {.css}
p {
  color: red;  
}

p {
  color: green;
}
```

The second rule with `color: green` will win, because it comes last.

## Including CSS in a webpage

When learning about CSS frameworks, you included `.css` files with a `link` element, like this:

``` {.html}
<link href="skeleton.css" rel="stylesheet" type="text/css">
```

Well, you can also include your own CSS with the same technique. You can call it whatever you want, but `style.css` is a pretty popular filename:

``` {.html}
<link href="style.css" rel="stylesheet" type="text/css">
```

There''s also another element that allows you to write CSS directly inside your HTML file:

``` {.html}
<style>
  p {
    color: black;
  }

  p.error {
    color: white;
    background-color: red;
  }
</style>
```

Open up one of your old pages and paste this `style` element into the `head`. Then try adding an `error` class to a paragraph to see what happens. After that, try playing around by changing the colors, using this [list of CSS color names](http://www.w3schools.com/colors/colors_names.asp).

The `style` element is mostly only used for quick prototyping or experiments. As you write more CSS, moving it to a separate `.css` file will not only keep your HTML clean, but also allows you to share styles between many pages.

## Colors in CSS

CSS only includes 140 named colors, which often isn''t enough. For example, there''s no name for this wonderful shade of pink:

~~~ {.result}
<div
  style="
    background-color: #C69;
    width: 50px;
    height: 50px;
  "
></div>
~~~

Fortunately, CSS offers many ways to identify very specific colors. We''ll walk through the most common ones, including examples of how to create this magnificent pink in your own websites.

### Color formats

#### RGB (red, green, blue)

<iframe width="100%" height="265" src="https://jsfiddle.net/hcodelab/0djaftL6/embedded/result/dark"></iframe>

Try clicking on the colored box to the right of the CSS rule above. It should open a color picker. Now try changing the color and watch how the value changes.

If you had art class in school, you may have learned about primary colors (red, yellow, and blue), which you can combine to create any other color. That works with paint, but on screens, the colors you combine to create any other are red, _green_, and blue.

In an RGB color, each of the three numbers, ranging from 0 to 255, specify the relative proportions of red, green, and blue, respectively.

Now you may be thinking:

<blockquote>
  Am I seriously supposed to learn how to make up colors by imagining which proportions of red, green, and blue they have?
</blockquote>

Definitely _not_. You won''t memorize any of these formats. Instead, you''ll use color pickers and other tools, like in the demo above.

#### RGBA (red, green, blue, _alpha_)

*Alpha* is technical jargon for *opacity* (the opposite of *transparency*). In an RGBA color, we gain a 4th argument ranging between:

* 0 (making the color completely invisible)
* 1 (meaning you can''t see through the color at all)

Try changing the alpha value for the pink square below to see the difference:

<iframe width="100%" height="275" src="https://jsfiddle.net/hcodelab/Ldtx9q24/embedded/result/dark"></iframe>

#### Hex (hexadecimal)

<iframe width="100%" height="275" src="https://jsfiddle.net/hcodelab/9kwjg47u/embedded/result/dark"></iframe>
  
Hex allows you to represent the same colors you can with RGB, but using fewer characters. You may also see even shorter hex codes, such as `#c69`. That''s shorthand for `#cc6699`.

~~~ {.note}
Though it doesn''t look like it, hex codes are actually 3 numbers squished together: `cc`, `66`, and `99`. We know what you''re thinking. "Wait - `cc`? That''s not a number!" Well, it isn''t in the base-10 _decimal_ system you''re used to, but it is in the base-16 _hexadecimal_ system. That means instead of 10 digits in its number system:

```
0 1 2 3 4 5 6 7 8 9
```

It has 16:

```
0 1 2 3 4 5 6 7 8 9 A B C D E F
```

That allows it to count up to 255 (`FF`) with two digits, rather than just 99. So:

* `cc` means 204
* `66` means 102
* `99` means 153
~~~

### Should you use RGB, RGBA, or Hex?

It doesn''t matter, unless you need a color to be partially transparent (then use RGBA). The rest is just personal preference. Hex is probably the most popular, simply because it''s shortest.

### Changing styles for the entire page

Let''s say you want the entire page to use a specific background color. Since everything that appears on the page should be in the `body` element, you can select it to accomplish this. To change the background from white (the default in most browsers), to a subtle shade of gray with a hint of color, you might use this rule:

``` {.css}
body {
  background-color: #f9f7f5;
}
```

You can also select the `body` to change the base `color` or `font-size` (you''ll learn about this later), among other things.

### Using VS Code to manage colors

VS Code comes with two really helpful features for working with colors in CSS files:

1. *Color Preview* is a box on the left of any CSS color that shows what that color looks like
2. *Color Picker* appears when you move the mouse over a CSS color and lets you use visually choose a color and format

Together, they allow you to do things like this:

![VS Code color picker and preview demo](https://i.imgur.com/tr3mHZd.gif)

### Inspect colors with the _ColorPick Eyedropper_ Chrome extension

If you''re not already using Chrome, it''s free and includes a lot of advanced tools to make web development easier. You''ll learn more about these in later lessons, but in the meantime, try the [_Colorpick Eyedropper_](https://chrome.google.com/webstore/detail/colorpick-eyedropper/ohcpnigalekghcmgcdcenkpelffpdolg?utm_source=chrome-app-launcher-info-dialog) extension to zoom in on a specific pixel and discover _exactly_ what color it''s using.

This is a great tool for stealing color schemes you like from other websites -- or pulling specific colors from a mockup image, so that you can replicate the design with CSS.

### Community color schemes

If it''s difficult for you to tell which colors go together, you''re in luck. There are many communities where people post color schemes they really like, such as:

* [Adobe Color](https://color.adobe.com/explore/most-popular/?time=all)
* [Colour Lovers](http://www.colourlovers.com/palettes)

Once you find one you like, you can click on it to see the hex codes for each color.

## Sizes in CSS

In the physical world, we often measure things in units of inches or centimeters. On screens, the primary unit of measurement is *pixels*. A pixel is just a dot on the screen that displays a specific color of light. On many modern screens, they can be difficult to see individually, unless you look very closely:

![Zoomed into the pixels in an "m"](https://i.imgur.com/4pr6G1d.png)

When building the square we used to show off colors, we actually specified that it should have a width and height of 50 pixels, like so:

<iframe width="100%" height="350" src="https://jsfiddle.net/hcodelab/78rvLjyc/embedded/result/dark"></iframe>

Try changing the number `50` in one of those values to something else and see how the former square changes shape. As you''ve probably noticed, we specify a number of pixels in CSS by putting `px` (short for _pixels_) directly after a number, with no space.

~~~ {.note}
The one time you don''t need to add `px` is with `0`. Both `0` and `0px` will do the same thing.
~~~

### Other size formats

There are also other ways of specifying sizes, but the two other most popular ones are:

* *Percent* of the containing (i.e. parent) element (e.g. `65%`)
* *Ems*, which is the size ratio relative to the height of the element''s current font size (e.g. if the font size is `10px`, then `1.7em` would be equivalent to `17px`)

For now, you can just stick to pixels most of the time and as you learn more, you''ll gradually discover which formats are best for each property/situation.

### Measure pixels with the _Grid Ruler_ Chrome extension

Most of the time, you can just experiment with pixels and see what looks good to you. Sometimes though, it''s important to be more exact.

For example, when you''re trying to build a website from a mockup provided by a designer, they probably gave a lot of thought to how much space should be between each item in the page and how large each one should be.

That''s where the [Grid Ruler](https://chrome.google.com/webstore/detail/grid-ruler/joadogiaiabhmggdifljlpkclnpfncmj/) extension for Chrome comes in. It allows you to create guides and measure distances on a page or image in your browser. Much easier and more precise than trial and error! 📐

Once you''ve added it to Chrome, click its icon to use it. Rulers will appear at the top and left sides of the browser tab. To create a guide, click and drag from one of the rulers.

To measure a distance, click the square in the top left corner between the rulers, then click and drag on the page to draw a line and measure its distance. You can also hold the `Shift` key to measure to draw a perfect vertical or horizontal line.

~~~ {.warning}
This extension will *not* work for local files. That means to measure the pixels in a project you''re working on, you have to use `live-server` and view the page at `localhost:8080`.
~~~

### When to use `width` and `height`

Once you learn about the `width` and `height` properties, it may be tempting to use them for page layouts, shaping your elements together like puzzle pieces. This does _not_ work well, mostly because users'' screens could be any size. Unlike when designing something that will be printed on paper, you can''t rely on fixed dimensions.

That''s why it''s usually best to let elements size themselves, based on their content. There are times, however, when you want to make sure something doesn''t get _wider_ than a specific size. For example, images in HTML will always appear at their full resolution by default, even if it means overflowing their container. We''ve still never encountered a situation where this is useful, but setting *`max-width`* on `img` elements can sometimes be useful:

``` {.css}
img {
  max-width: 100%;
}
```

Then if an image is `100px` wide and it''s in a `50px` container, it will shrink to `50px` instead of overflowing. If the container grows to `100px` or wider, the image also won''t get larger than `100px`:

<img src="https://i.imgur.com/dGIv6av.png?1" alt="max-width cat picture">

This is an important difference from `width: 100%`, which would not only shrink images to the width of their containers, but also _stretch_ them so that they become blurry, like this:

<img src="https://i.imgur.com/dGIv6av.png?1" alt="Stretched out cat picture" style="width: 100%">

Another common use case is to restrict how wide text content can grow. Humans have a much more difficult time reading when lines are very long, so sometimes rules like this are helpful:

``` {.css}
.blog-content {
  max-width: 600px;
}
```

As for the `height` property, you might want to use it on an `iframe` or `video` element, but for most other elements, it''s usually better to let them shrink and grow on their own to fit their content.

## More CSS properties using colors and sizes

Now we''ll dive into some new CSS properties with a hypothetical scenario. Let''s say you''re working on a blogging platform and you want to style the `blockquote` element so that longform quotes stand out more, like on _Medium_ and many other sites.

Someone else gave it a try and came up with some really ugly styles. You might not know how these properties work right now, but see how much you can figure out by playing with the values below, while watching the blockquote below them change.

<iframe width="100%" height="800" src="https://jsfiddle.net/hcodelab/gxz93jmc/embedded/result/dark"></iframe>

Starting to get the hang of it? Now see if you can make the blockquote look more like this (note: your font may be different):

![Blockquote mockup](https://i.imgur.com/ab9TClA.png)

Finally, let''s take a deep dive into each property with a new resource called [CSS Reference](http://cssreference.io/). It includes detailed descriptions of every CSS property, including many examples and diagrams. For most properties, this is probably the best resource to learn more:

* [`margin`](http://cssreference.io/property/margin/)
* [`padding`](http://cssreference.io/property/padding/)
* [`font-size`](http://cssreference.io/property/font-size/)
* [`line-height`](http://cssreference.io/property/line-height/)
* [`color`](http://cssreference.io/property/color/)
* [`background-color`](http://cssreference.io/property/background-color/)
* [`border-radius`](http://cssreference.io/property/border-radius/)
* [`border-left-width`](http://cssreference.io/property/border-left-width/)
* [`border-left-style`](http://cssreference.io/property/border-left-style/)
* [`border-left-color`](http://cssreference.io/property/border-left-color/)

## Properties with multiple values

As you probably saw when browsing information about the properties in the last page, some can accept several values. Just like the values of HTML attributes like `class`, these are separated by spaces.

For example, while `margin: 10px` will set the margin for all sides to `10px`, `margin: 10px 20px 30px 40px` sets the margin for each side, starting at the top and moving clockwise:

* the top margin is `10px`
* the right margin is `20px`
* the bottom margin is `30px`
* the left margin is `40px`

Many properties can even be combined into a single property. For example, these border properties:

``` {.css}
border-left-width: 2px;
border-left-style: solid;
border-left-color: orange;
```

Can be combined into: 

``` {.css}
border-left: 2px solid orange;
```

## Common selectors

So far, you''ve seen how to select all of a specific type of element using the element''s name. For example:

``` {.css}
body {
  font-size: 16px;
  background-color: #f9f7f5;
}

h1 {
  font-size: 34px;
  margin: 10px 0 30px;
}

p {
  margin: 20px 0;
}
```

You''ve also seen how to target an element by its class, with a `.` before the name of the class:

``` {.css}
p.error {
  color: red;
}
```

You can even target classes on their own, without a specific element type:

``` {.css}
.error {
  color: red;
}
```

That will make the text red for _any_ element with an `error` class. 

Those are the very basics, but there are many other ways to select elements in CSS. We''ll introduce a few more of the most commonly used ones now.

### Selecting elements inside of another element

In the example below, only elements with a class of `title` that are **descendents** of (nested inside of) an element with a class of `error` will be selected.

``` {.css}
.error .title {
  font-size: 18px;
  margin: 10px 0;
}
```

~~~ {.result}
<style>
.error {
  border: 1px solid darkred;
  padding: 5px 20px;
  background-color: pink;
}
.error .title {
  font-size: 18px;
  margin: 10px 0;
}
</style>
<h1 class="title">This is a regular title</h1>
<div class="error">
  <h5 class="title">This is a title in an error</h5>
</div>
~~~

To accomplish this, we''ve just added a space between each the item. You can even take this multiple levels. Are you ready?

``` {.css}
.error .title strong span.note {
  font-size: 18px;
  margin: 10px 0;
}
```

That selects:

1. all `spans` with a class of `note` 
2. that are descendents of a `strong`
3. which in turn is a descendent of an element with a class of `title`
4. which is also a descendent of an element with a class of `error`

If your head is spinning a little, you''re not alone. That''s an especially complex selector!

### Apply the same styles to multiple selectors

You can apply the same styles to multiple selectors by separating each selector with a comma:

``` {.css}
h1, h2, h3, h4, h5, h6 {
  color: darkgray;
}
```

That makes the text of every heading element dark gray.

### Select elements that are _hovered over_ with the mouse

This one is great because it allows your pages to be a little more interactive. It''s most often used with elements that users already interact with, like anchor (`a`) elements:

``` {.css}
a {
  color: green;
}

a:hover {
  color: darkgreen;
  text-decoration: underline;
}
```

~~~ {.result}
<a class="demo" href="javascript:void(0)">Move your pointer over me, but don''t click!<style>
a.demo { color: green; }
a.demo:hover { color: darkgreen; text-decoration: underline; }
</style></a>
~~~

As you may be able to guess, adding the `:hover` *pseudo-class* selects that element _only_ when the user''s mouse is hovered over it. Together, the above rules make all links green, except they change to dark green when the mouse is over them.
', 'For the project, it''s not necessary for reviewers to actually measure by the pixel. If you think you could look at both versions (the mockup and the student''s), then be presented with one and not be sure which you''re seeing, it can be considered done. Also note that the `font-weight` is _not_ part of this project. The font may render a little thinner/thicker, depending on operating system.', '-KapljSqrWOHlciMnt09', 'Style a simple app based on a mockup', 'GitHub Pages', 4);


--
-- Data for Name: lesson_learning_objective; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (241, 200, 1, 'Know some common features of CSS frameworks', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (242, 200, 2, 'Use CSS classes to apply specific styles from frameworks', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (243, 200, 3, 'Find and use documentation for CSS frameworks', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (244, 200, 4, 'Use Google, Stack Overflow, and other resources to learn to do specific things', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (245, 200, 5, 'Be familiar with `div` and `span` elements and when to use them', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (246, 201, 1, 'Recognize and understand the purposes of CSS rules, selectors, properties, and values', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (247, 201, 2, 'Include CSS in a webpage with `style` and `link` elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (248, 201, 3, 'Recognize and use CSS hex, RGB, and HSL color values', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (249, 201, 4, 'Use extensions in VS Code to better work with CSS colors', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (250, 201, 5, 'Find color schemes/themes/palettes online, to avoid having to figure out which colors look good together', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (251, 201, 6, 'Recognize and use pixel values in CSS', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (252, 201, 7, 'Recognize percent and EM values in CSS', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (253, 201, 8, 'Recognize and use properties that accept multiple values', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (254, 201, 9, 'Use very basic selectors to target elements in CSS', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (255, 206, 1, 'Install and use a code editor to manage a simple project', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (256, 206, 2, 'HTML element basics, including tags and attributes', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (257, 206, 3, 'Inline vs block elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (258, 206, 4, 'Nesting elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (259, 206, 5, 'Self-closing elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (260, 206, 6, 'The limits of HTML (what one cannot expect to do with it alone)', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (261, 207, 1, 'Understand and use the essential elements in valid HTML', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (262, 207, 2, 'Use VS Code features to facilitate writing HTML', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (263, 207, 3, 'Understand the importance of and write with consistent indentation and spacing', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (264, 207, 4, 'Use the `link` element to use external HTML', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (265, 209, 1, 'Understand the semantic, structural, and presentational purposes of HTML', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (266, 209, 2, 'Use, without abusing, HTML features to control spacing (`br`, `&amp;nbsp;`, `pre`)', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (267, 209, 3, 'Use `table` elements and its other associated elements to build tables', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (268, 209, 4, 'Use the `video` and `audio` elements to present rich media', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (269, 209, 5, 'Use the `iframe` element to present external content', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (270, 210, 1, 'Install Node, NPM, and live-server', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (271, 210, 2, 'Use live-server alongside VS Code for improved productivity', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (272, 210, 3, 'Build a website with multiple `.html` pages', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (273, 210, 4, 'Build a website with nested routes', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (274, 210, 5, 'Link between pages with absolute, relative, and root-relative links', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (275, 211, 1, 'Understand the difference between syntax and semantics', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (276, 211, 2, 'Present important page content using `main`', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (277, 211, 3, 'Organize independent content with `article`, `header`, and `footer`', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (278, 211, 4, 'Decorate articles with `figure`, `figcaption`, and `aside`', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (279, 211, 5, 'Group navigational elements using `nav`', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (280, 211, 6, 'Use semantic HTML elements to improve SEO and accessibility', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (281, 212, 1, 'Use terminal commands, with and without arguments', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (282, 212, 3, 'Use Git and GitHub to manage projects', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (283, 212, 2, 'Navigate folders in the terminal', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (284, 213, 1, 'Understand the value of and use JS Standard to lint JavaScript', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (285, 213, 2, 'Collect information from users with the `prompt` function and `input` element', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (286, 213, 3, 'Understand the basic concept of a property, how to get and set them, and how to explore them in the console', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (287, 213, 4, 'Use online resources to learn more about unfamiliar properties', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (288, 213, 5, 'Understand the differences between `textContent` and `innerHTML` and how to use each', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (289, 214, 2, 'Understand and use comparison operators', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (290, 214, 3, 'Understand the concept of an expression', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (291, 214, 4, 'Understand the difference between strict equality and type coercion', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (292, 214, 5, 'Be aware of some of the gotchas of type coercion', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (293, 214, 6, 'Know to (almost) never use == or !=', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (294, 214, 1, 'Use if, else if, and else to branch operations', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (295, 214, 7, 'Use &&, ||, and parentheses to combine expressions', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (296, 214, 11, 'Use `Math.random()` to create random branches of events', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (297, 214, 8, 'Be aware of and know how to handle many edge cases for string input', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (298, 214, 9, 'Be aware of and know how to handle many edge cases for numbers', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (299, 214, 10, 'Be aware of the dangers of and know how to cope with `null` and `undefined`', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (300, 217, 1, 'Understand what JavaScript is (generally) and the kinds of web features it can be used for', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (301, 217, 2, 'Understand how to include JavaScript in pages with `script` elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (302, 217, 3, 'Open the Chrome JavaScript console', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (303, 217, 4, 'Understand how to use numbers and some basic operators in JavaScript', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (304, 217, 5, 'Understand how to form strings in JavaScript', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (305, 217, 6, 'Understand the purpose of and how to use variables in JavaScript with the `var` keyword', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (306, 217, 7, 'Understand the purpose of and basics of functions in JavaScript', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (307, 217, 8, 'Understand and use events and callbacks to respond to user interactivity', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (308, 229, 1, 'Develop detailed personas', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (309, 231, 1, 'HTML form types and usage', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (310, 231, 2, 'Bootstrap forms classes and usage', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (311, 232, 1, 'HTML5', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (312, 233, 1, 'CSS3', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (313, 233, 2, 'Responsive Design', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (314, 233, 3, 'HTML5', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (315, 234, 1, 'HTML5', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (316, 234, 2, 'CSS3', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (317, 235, 1, 'CSS', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (318, 236, 1, 'CSS', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (319, 236, 2, 'JavaScript', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (320, 237, 1, 'Explore wireframing tools', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (321, 237, 2, 'Create low resolution designs that help communicate user experience and copy', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (322, 238, 1, 'End-to-end build out of a complete site', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (323, 239, 1, 'Install and use a code editor to manage a simple project', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (324, 239, 2, 'HTML element basics, including tags and attributes', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (325, 239, 3, 'Inline vs block elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (326, 239, 4, 'Nesting elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (327, 239, 5, 'Self-closing elements', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (328, 239, 6, 'The limits of HTML (what one cannot expect to do with it alone)', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (5533, 5532, 0, 'Wireframes and lo-fidelity website concepts', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (5534, 5532, 1, 'Exploring design ideas using style tiles', 0);
INSERT INTO lesson_learning_objective (lesson_learning_objective_id, lesson_id, "position", content, version) VALUES (5542, 5541, 0, 'Complete a fully built, production-ready website', 0);


--
-- Data for Name: lesson_prerequisite; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (200, 207, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (201, 200, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (202, 204, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (203, 205, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (203, 211, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (204, 205, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (205, 201, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (206, 212, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (207, 239, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (208, 210, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (208, 211, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (209, 207, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (210, 207, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (211, 200, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (211, 209, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (213, 217, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (214, 213, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (215, 220, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (216, 214, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (217, 209, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (217, 210, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (218, 201, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (218, 214, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (219, 218, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (220, 219, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (221, 222, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (221, 220, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (222, 203, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (222, 219, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (223, 219, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (224, 221, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (225, 207, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (227, 225, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (228, 207, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (229, 228, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (230, 227, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (230, 209, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (230, 210, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (231, 200, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (232, 207, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (233, 232, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (234, 233, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (235, 234, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (236, 235, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (237, 229, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (238, 237, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (239, 212, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (240, 224, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (3752, 224, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (5378, 207, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (5532, 5378, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (5541, 5532, 0);
INSERT INTO lesson_prerequisite (lesson_id, prerequisite_lesson_id, version) VALUES (5933, 239, 0);


--
-- Data for Name: lesson_project_criterion; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (329, 200, 1, 'Include the CSS and JS for Bootstrap 4 in the page (include any JavaScript dependencies)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (330, 200, 2, 'Use the `container` class to center your page content', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (331, 200, 4, 'Show your main content in a 2-column grid on large (`lg`) and medium (`md`) sized screens, but only shows them in one column on small (`sm`) and extra small (`xs`) screens', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (333, 200, 3, 'Use a `navbar` component to display the name of your site and a list of at least 3 links (to past projects, or anything else) at the top of your page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (334, 200, 5, 'Include at least one image that is only visible on medium (`md`) screens and larger, using `display` utilities', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (360, 205, 6, 'The styles from the "Create Account" button [in the middle of this page](http://plant-servant.surge.sh/) are used for your "Search" button (it should even use the same styles on `hover` and `active`)', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (337, 201, 3, 'Any CSS selectors or properties may be used, though the project is possible using only what you saw in the lesson', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (338, 201, 4, 'No spacing HTML (e.g. `<br>`, `&amp;nbsp;`) is added to `index.html`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (341, 203, 1, 'All components in [this HTML](https://gist.github.com/egillespie/15433761e640077f93660b4555a3d88b) are styled using Sass', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (343, 203, 5, 'Elements shaped like a box (`img`, `input[type="text"]`, `textarea`) have the same `border-radius`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (344, 203, 9, 'A source map for your component library is included in the project', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (346, 203, 2, 'Use four colors from a [random color palette](https://coolors.co/) (just copy the hex values into your Sass file) and link to your palette in the HTML', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (347, 203, 6, 'At least one built-in Sass function is used to style a component', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (348, 203, 8, 'Sass files are saved in a `source` directory and CSS files are saved in a `compiled` directory', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (349, 204, 1, 'Demonstrate an understanding of the CSS we''ve learned so far in the class', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (350, 204, 2, 'Use Flexbox to create the layout of your page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (351, 204, 3, 'Use `margin` and `padding` to create space in and between elements', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (352, 204, 4, 'Use display `block` and `inline-block` properly', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (353, 204, 5, 'Have fun and do your best to make it pretty, the result should be something you would show to a future employer', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (354, 205, 2, 'The font size of the search engine name is at least 70 pixels, so that it''s very easy to see', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (355, 205, 3, '`span` elements are wrapped around each letter of the name, like this: `<span>G</span><span>o</span><span>o</span><span>g</span><span>l</span><span>e</span>`, so that they can be styled individually with classes', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (356, 205, 4, 'The on-hover colors from the paragraphs [on this page](http://skillful-clouds.surge.sh/) are used to color individual letters of your name (similar to the letters in Google''s logo)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (358, 205, 8, 'All your CSS exists in a `.css` file', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (359, 205, 1, 'The page includes the name of your search engine in big letters (you can make it up), with a search `input` below it, then a button below that to run the search (the button doesn''t have to do anything for this prototype)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (362, 206, 1, 'Each of the following elements is used appropriately, at least once: `h1`, `h2`, `p`, `img`, `li`, `a`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (363, 206, 2, 'At least one of the following elements is used: `ol`, `ul`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (364, 206, 3, 'At least one external image is used and links to the page it came from', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (365, 207, 2, 'Your code returns no errors (warnings are OK) when pasted into the [W3C Validator](https://validator.w3.org/#validate_by_input) (this will also be expected for all future projects)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (366, 207, 3, 'Consistent spacing and indentation are used on every line (this will also be expected for all future projects)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (367, 207, 4, '`skeleton.css` is used to improve the design of the page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (368, 207, 1, 'The files from your last project are copied and pasted into the directory for this project', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (369, 208, 1, 'Include a homepage and at least one other page, for your best-selling T-shirt (you can download a T-shirt image [from ThinkGeek](http://www.thinkgeek.com/clothing/t-shirts/))', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (370, 208, 3, 'A `title` and `meta name="description"` are provided for each page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (372, 208, 6, 'When each page is shared on Facebook and Twitter, a beautiful card is generated (and the [respective](https://developers.facebook.com/tools/debug/sharing/) [validators](https://cards-dev.twitter.com/validator) should return no errors/warnings -- though you can ignore the `The following required properties are missing: fb:app_id` warning for Facebook)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (373, 208, 2, 'A language is specified for the website (it does _not_ have to be in English!)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (374, 208, 5, 'Location information is provided on every page (you can place the store anywhere in the world, as long as there''s an existing building there)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (361, 205, 7, 'There are no linter errors in your CSS (this will also be expected for all future projects)', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (357, 205, 5, 'Inspect the `input` element at the bottom of the [_Prototyping states_ page of the lesson](../5) to create an identical-looking search box for your own site (it should even use the same styles on `focus`)', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (332, 200, 6, 'Use an `img-thumbnail` class on an at least one image in your page', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (371, 208, 4, 'Every page includes a link to a `favicon.ico` file with the company logo (you can [create one here](https://hipsterlogogenerator.com) or design one yourself)', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (342, 203, 3, 'Font sizes are all determined by one base font size variable, even in `input` and `textarea` elements, and headings are all differently sized', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (335, 201, 2, 'Your project is built off [this base HTML and CSS](https://gist.github.com/egillespie/904ae7bb8eda4f74687d96efe4bc4cc3) (you may modify both pages however you want, e.g. adding classes or more elements)', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (375, 209, 1, 'Include [a haiku](http://www.kidzone.ws/poetry/haiku.htm), describing the feelings this product will evoke (with `br` elements to add new lines where appropriate)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (500, 237, 6, 'PDFs must be uploaded to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (339, 201, 5, 'Add at least one link (`a` element) to the page and style them to be `green` normally, but turn `orange` on hover', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (376, 209, 3, 'Include a table comparing which features your game has in comparison to competitors (these competitors may be real or made up)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (377, 209, 4, 'Include a demo video from YouTube, but featuring a completely unrelated animal being cute (not getting hurt!)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (378, 209, 2, '[Create and download a sound effect file](http://www.beepbox.co/) for what the game will sound like when you win, then include an audio player in the page so users can hear the sample', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (379, 210, 1, 'None of the routes on the website end with `.html`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (380, 210, 2, 'A homepage exists, where the purpose of the site is explained', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (381, 210, 3, 'A "list page" exists that lists your top 3 favorite of this thing (e.g. `/pokemon`) -- each list item should link to the corresponding page for that favorite, detailed below', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (382, 210, 4, 'For each of your favorites, a page exists to display more information about it (e.g. `/pokemon/bulbasaur`) -- we want to make sure you practice multiple levels of nested routes', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (383, 210, 5, 'Every page includes links to the homepage and list page (although pages do not have to link to themselves)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (384, 211, 2, 'Use the `main` element appropriately', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (385, 211, 3, 'Include three products your store sells, all listed on the same Products page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (386, 211, 4, 'For each product, correctly use an `article`, `header`, and `footer` element', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (387, 211, 5, 'Use `figure` and `figcaption` to show what each product looks like', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (388, 211, 6, 'Each product includes a `nav` element with one or more links to related products (the links don''t have to go anywhere)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (389, 211, 1, 'Place a `nav` element at the top of the page that includes (fake) links to other pages', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (390, 211, 7, 'Use an `aside` in one or more products to advertise a promotion or discount for that product', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (391, 212, 1, 'A knock-knock joke is displayed when visiting the website', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (392, 212, 2, 'The code is pushed to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (393, 212, 3, 'The website is hosted on GitHub Pages', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (394, 213, 1, 'Use [this base HTML](https://gist.github.com/chrisvfritz/1b25d9037fb64e3486ea2df8179f9ce8) (feel free to change it) to build a simple app that generates the HTML for a dating profile [in this format](https://gist.github.com/chrisvfritz/4043b4d043610a2bb9cd26444c3e7a45), using information collected from the user', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (395, 213, 2, 'Show a preview of the dating profile with rendered HTML (e.g. `<em>hella charming</em>` should appear as _hella charming_)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (396, 213, 3, 'Also show the raw, generated HTML inside the `<pre><code></code></pre>` elements (e.g. `<em>hella charming</em>` should appear as `<em>hella charming</em>`)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (397, 213, 5, 'All JavaScript is in a separate `.js` file', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (398, 213, 4, 'Both the preview and raw HTML should update live as the user enters their information', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (399, 213, 6, 'There are no linting errors in your JavaScript (this will also be expected for all future projects)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (410, 217, 1, 'At least 3 `button` elements are included in your page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (412, 217, 3, 'Each button is well-labeled, corresponding to the sound it will play', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (413, 217, 4, 'All `audio` elements are invisible (no `controls` attribute), so that they can only be played with the buttons', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (414, 217, 5, 'All of your JavaScript is in a separate file ending with `.js`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (415, 218, 1, 'Includes a button that when clicked, will toggle the website between day and night themes', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (416, 218, 4, 'When the body has the class `day-theme`, the background of the website is light-colored, with a darker color for the text', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (417, 218, 5, 'When the body has the class `night-theme`, the background of the website is a very dark color, with a lighter color for the text', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (418, 218, 2, 'When a user changes the theme, their choice is remembered in `localStorage`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (419, 218, 6, 'Somewhere on the page, the user is told how many times they''ve visited the website (starting with `1` the first time)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (420, 218, 3, 'The class on the `body` element is always up-to-date with the current theme (either `day-theme` or `night-theme`) -- you can use `document.body.setAttribute(''class'', ''some-class-name'')` to set the class on the `body`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (421, 219, 6, 'Whenever the `jokes` object changes, the new version is saved in `localStorage` and used whenever the user visits the page again', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (472, 229, 1, 'Use the base personas you developed in the previous module (for your pitchboard)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (422, 219, 2, 'When the `requestedJokeInput` has a value matching the key of an existing joke, the `jokeBox` HTML is updated [in this format](https://gist.github.com/chrisvfritz/4def3c246dfb931ecb57384a5639af99)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (423, 219, 3, 'When the `requestedJokeInput` does _not_ match an existing joke, the `jokeBox` content is updated to `No matching joke found.`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (424, 219, 4, 'When the `Remember this joke!` button is clicked, a new joke is saved (or overwritten) in the `jokes` object, using the data in the associated `input`/`textarea` elements', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (425, 219, 5, 'When the `Forget about it!` button is clicked, the joke with that key (if any) is deleted from the `jokes` object', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (427, 219, 7, 'It''s impossible for an error to ever occur in the JavaScript console', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (428, 220, 1, 'At every URL, you respond with HTML, starting with an `h1` element (though for this project, it doesn''t have to be a complete HTML page)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (429, 220, 2, 'When a user visits `/`, they see a greeting', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (430, 220, 4, 'When a user visits `/cuteness`, they see a picture of a cute animal (I''m sure you can find one on the Internet 😛)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (431, 220, 5, 'At every other URL, display an error page (if you want to make it funny, see [these examples](http://www.hongkiat.com/blog/60-really-cool-and-creative-error-404-pages/) for inspiration)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (432, 220, 3, 'When a user visits `/random-joke`, they see one of at least three [knock-knock jokes](http://www.short-funny.com/best-knock-jokes.php) (`Math.random()` may be useful 😉)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (340, 203, 7, 'Variables are defined in their own Sass module', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (433, 220, 6, 'The error page includes the requested URL, similar to [Google''s error page](http://google.com/secret-plan-to-take-over-the-world)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (434, 220, 7, 'Every page that is _not_ the homepage (`/`) contains a link to the homepage', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (435, 221, 2, 'Make a navigation to move throughout your site, using `forEach` to create a set of links to other data pages', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (436, 221, 1, 'No code is repeated in your files; create a partial for any shared elements (`nav`, `head`, `header`, etc.)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (437, 221, 3, 'Each item should have an object with an image, a link, a title, and more properties based on your topic (i.e. sandwich ingredients, movie release date, etc.)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (438, 221, 4, 'Include at least 3 data pages and a homepage; routes should be created in Express for each', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (439, 221, 6, 'Use `express.static` to create a folder for static assets (images, stylesheets, etc.)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (440, 221, 5, 'Use data appropriately with HTML tags (paragraphs in `p` tags, headings in `h1`-`h6`, etc.)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (441, 221, 7, 'Include a `.gitignore` file so that `node_modules` and any other unnecessary files are not commited to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (458, 224, 1, 'Todos should have a field for the todo text and one to indicate whether or not the task has been completed', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (459, 224, 2, 'User should be able to see all todo items at `/todos`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (460, 224, 3, 'POSTing to `/todos` should create a new todo item', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (461, 224, 4, 'Should be able to `GET`, `PUT`, and `DELETE` to `/todos/:id`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (462, 224, 7, 'All requests and responses should be in JSON format', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (463, 224, 8, 'Should have a `.gitignore` file to keep unwanted files and folders from being tracked by git', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (464, 224, 5, 'URLs besides `/todos` and `/todos/:id` respond with a 404 status code', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (465, 224, 6, 'If a specific todo at `/todos/:id` does not exist, a 404 status code should be returned', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (467, 228, 2, 'The Pitchboard must include a short and long elevator pitch, three (3) personas that represent users of your website and three (3) "comp" sites that represent similar ideas or other players in your market', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (468, 228, 3, 'Format your Pitchboard using HTML', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (469, 228, 4, 'Add style to your Pitchboard using your own CSS or a framework like Bootstrap', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (470, 228, 5, 'All markup and style must be valid (use your linter or W3C validator)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (471, 228, 1, 'Create a name for your space company', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (426, 219, 1, 'Your app builds on [these files](https://gist.github.com/egillespie/6afd46015d7d185cb33e46fd4796445f) (you can make changes to any of them)', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (457, 223, 7, 'Use the `TODO` comments in `woofer-db.js` as your guide for placing code', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (456, 223, 5, 'Anyone can delete any message by clicking the red X icon', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (455, 223, 4, 'Anyone can edit any message by clicking the pencil icon, typing a new message, and pressing Enter', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (454, 223, 6, 'When a message is added, edited, or deleted, _Recent woofs_ automatically updates for everyone viewing the page', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (473, 229, 2, 'Complete a detailed persona worksheet for each persona (you should have 3) (https://creativecompanion.wordpress.com/2011/05/05/the-persona-core-poster/)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (474, 229, 3, 'Build a multi-page website--each persona should have it''s own page and should include all the information from your worksheets', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (475, 229, 4, 'Make sure you have a homepage with text links to each persona', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (476, 231, 2, 'Create a valid HTML file using Bootstrap 4 CSS', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (477, 231, 3, 'The form must capture the following: Name, Address (Street, City, State, ZIP), Age, Male/Female, t-shirt size', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (478, 231, 4, 'You must use at least one of each form field type: text, select and radio or checkbox', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (479, 231, 5, 'The form should have a heading, a brief description and be centered on the page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (480, 231, 6, 'The form should have a submit button (but it doesn''t have to actually submit, just show the button)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (481, 231, 1, 'Choose a sport and race type for your form (running/marathon, sailing/regatta, etc)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (482, 232, 1, 'Complete Dash Project #1', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (483, 232, 2, 'Save screenshot of completed project screen in Dash', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (484, 232, 3, 'Push screenshot to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (485, 233, 1, 'Complete Dash Project #2', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (486, 233, 2, 'Save screenshot of completed project screen in Dash', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (487, 233, 3, 'Push screenshot to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (488, 234, 1, 'Complete Dash Project #3', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (489, 234, 2, 'Save screenshot of completed project screen in Dash', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (490, 234, 3, 'Push Screenshot to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (491, 235, 1, 'Complete Dash Project #4', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (492, 235, 2, 'Save screenshot of completed project screen in Dash', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (493, 235, 3, 'Push screenshot to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (494, 236, 1, 'Complete Dash Project #5', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (495, 236, 2, 'Save screenshot of completed project screen in Dash', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (496, 236, 3, 'Push screenshot to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (497, 237, 1, 'Homepage wireframe saved as a PDF', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (498, 237, 2, 'Internal page wireframe saved as a PDF', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (499, 237, 3, 'Complete copy for each page (no lorem ipsum or placeholder copy) in place within the wireframes', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (501, 237, 4, 'Identify one additional wireframing tool not mentioned in the module notes (separate PDF)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (502, 237, 5, 'Make sure your design and copy decisions are based on personas and pitchboards', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (503, 238, 1, '4 valid HTML pages (1 homepage and 3 internal pages)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (504, 238, 2, 'Site must be styled using CSS (typography and layout)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (505, 238, 3, 'Bootstrap can be used, but you must also include at least 10 custom CSS rules', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (506, 238, 4, 'All images and copy must be complete (no placeholder images or "lorem ipsum")', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (507, 238, 5, 'Site must be based off of your pitchboard and personas from the previous modules', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (508, 238, 6, 'Site must include 1 @media query (mobile/responsive rule)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (509, 238, 7, 'No paths should display "index.html"--use the same method for internal pages as you did in the multiple pages module', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (510, 238, 8, 'Site is hosted on Surge', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (511, 239, 1, 'Each of the following elements is used appropriately, at least once: `h1`, `h2`, `p`, `img`, `li`, `a`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (512, 239, 2, 'At least one of the following elements is used: `ol`, `ul`', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (513, 239, 3, 'At least one external image is used and links to the page it came from', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (514, 240, 1, 'All of your site''s content is created using React components', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (515, 240, 2, 'One component displays an "under construction" banner or a page counter that does _not_ work', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (516, 240, 3, 'One component shows one of several GIFs or clip art on the page depending on a `props` value', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (517, 240, 4, 'One component uses a loop to show 5 pictures and captions [about your topic](http://www.fanpop.com/channel/show/popular) (PG-13, please)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (518, 240, 5, 'JSX is used for all React components', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (519, 240, 6, 'jQuery is not used in the project', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (520, 240, 7, 'The site should look like [every other website from the 90s](https://www.hover.com/blog/10-things-that-used-to-be-on-every-website-that-you-totally-forgot-about/)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (3753, 3752, 0, 'Start with the code from your todo list API', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (3754, 3752, 1, 'The same Heroku Postgres database is used when running locally and on the hosted site', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (3755, 3752, 2, 'All todo items are saved in a `todo` table in the database', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (3756, 3752, 3, 'The DDL to create the `todo` table is saved in the project', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (3757, 3752, 4, 'The `pg` client is used to create a connection pool and access the database', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (3758, 3752, 5, 'All routes use SQL queries for accessing todo items', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (3759, 3752, 6, 'Query parameters are used whenever route data is combined with SQL', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5384, 5378, 5, 'Pitchboard has basic CSS styles and a layout', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5383, 5378, 3, 'Pitchboard includes three comparable sites ', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5382, 5378, 2, 'Pitchboard includes three personas that represent the core audience or user base', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5381, 5378, 1, 'Pitchboard includes a long elevator pitch', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5380, 5378, 0, 'Pitchboard includes a short elevator pitch', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (336, 201, 1, 'The website looks (nearly) identical to [this mockup](https://i.imgur.com/ayRsKnO.png) in the Chrome web browser -- colors must be exact, spacing/sizes should be within about `5px` (Tips: Use the _Grid Ruler_ extension to measure exact sizes/spacing; make sure you are zoomed in on the image so the white boxes are 500px wide)', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5379, 5378, 4, 'Pitchboard is delivered as an HTML document', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5535, 5532, 0, 'Create a wireframe for your final project homepage and internal page', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5536, 5532, 1, 'Make sure you have real copywriting in your wireframes', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5537, 5532, 2, 'Use one of the wireframing tools above or find your own solution (you can sketch and scan too)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5538, 5532, 3, 'Create two (2) style tiles exploring design ideas for your final project', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5539, 5532, 4, 'Save both your wireframes and style tiles as a PDF', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5540, 5532, 5, 'Upload all PDF assets to GitHub', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (5543, 5541, 0, 'https://jsiarto.gitbook.io/mi-349/final-project', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (453, 223, 3, 'Messages are stored in the database using the structure shown in `model.json`', 3);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6836, 5933, 0, 'The skill is learned from a 45-minute or more video, podcast, or event', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6841, 5933, 2, 'The article uses complete sentences to explain what you learned, but it''s okay if the spelling and grammar aren''t perfect', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6839, 5933, 4, 'At least five other types of Markdown notation are used that are not headings or links', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6838, 5933, 3, 'The blog has at least two levels of headings and a link to the video, podcast, or event', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6842, 5933, 6, 'The article is viewable at the top level (`/`) of your hosted site', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6840, 5933, 5, 'The hosted site is generated with a built-in GitHub Pages theme', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6837, 5933, 1, 'All blog content is in one Markdown file containing [at least 400 words](https://wordcounter.net)', 3);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (6878, 221, 7, 'All pages on the hosted site are valid HTML (use the [W3C Validator](https://validator.w3.org/nu/?doc=) to verify each page)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7370, 214, 0, 'Use `confirm` to ask if the visitor would like to play the game; OK starts the game and Cancel ends the game immediately', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7371, 214, 1, 'Use `prompt` to collect "rock", "paper", "scissors" guesses from the human player', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7372, 214, 2, 'Spaces before or after a human player''s guess are ignored', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7373, 214, 3, 'The human player can use both uppercase and lowercase letters for their guess (e.g. "ROCK" and "Rock" are the same as "rock")', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7374, 214, 4, 'If the human player guesses "scissor" it is treated as if they typed "scissors"', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7375, 214, 5, 'Any guess that is not "rock", "paper", or "scissors" is a win for the computer player', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7376, 214, 6, 'Use `Math.random()` to pick the computer player''s guess', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7377, 214, 7, 'Use `if`, `else if`, and `else` to find out who wins the match (rock beats scissors, scissors beats paper, paper beats rock)', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7378, 214, 8, 'The game is played up to three times and ends as soon as a player has won two matches', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7379, 214, 9, 'An `alert` shows the human and computer player''s guess and also shows who won the match', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7380, 214, 10, 'An `alert` at the end of the game shows who won the most matches', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (7519, 223, 8, 'No changes are made to the `woofer-ui.js` file', 0);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (452, 223, 2, 'A message and its creation time are added to the database when Enter is pressed or Woof is clicked', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (451, 223, 1, 'Your own Firestore database is used to store all of the site''s messages', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (450, 223, 0, 'Use [this code](https://gist.github.com/egillespie/942cc3aed19977590b431c10333736c2) as a foundation for your project', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (345, 203, 4, 'All text uses the same font family, even `input` and `textarea` elements', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (411, 217, 2, 'When each of the buttons is clicked on (`click` event), a unique sound effect plays from an `audio` element (try the `.play()` method) -- you may use [these drum kit sounds](/static/audio/drum-sounds.zip) or use any other sounds that won''t hurt/irritate the people who listen to them', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (442, 222, 0, 'Start your project with [these old game files](https://gist.github.com/egillespie/61d72035cd8c2639f07db1dbe2010605)', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (443, 222, 1, 'Convert the game''s CSS to Sass, using variables, functions, and nesting where appropriate', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (444, 222, 2, 'Write a `dev` script in `package.json` that auto-compiles Sass and refreshes the browser at the same time', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (446, 222, 5, 'Write a `deploy` script in `package.json` that builds the project and uploads it to Surge if there are no errors', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (447, 222, 6, 'Unnecessary files like `node_modules` and your compiled CSS do not exist in your repository', 1);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (449, 222, 4, 'All linting problems are fixed (problems will be displayed in the terminal when you run `npm run build`)', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (448, 222, 7, 'Unnecessary files like `package.json` and `package-lock.json` are not uploaded to Surge', 2);
INSERT INTO lesson_project_criterion (lesson_project_criterion_id, lesson_id, "position", content, version) VALUES (445, 222, 3, 'Write a `build` script in `package.json` that lints HTML, Sass, and JavaScript files before compiling Sass files (you can use these linters: [htmlhint](https://www.npmjs.com/package/htmlhint) for HTML, [stylelint](https://github.com/stylelint/stylelint/blob/HEAD/docs/user-guide/get-started.md) and [stylelint-config-recommended-scss](https://github.com/stylelint-scss/stylelint-config-recommended-scss#installation) for Sass, [standard](https://www.npmjs.com/package/standard) for JavaScript)', 3);


--
-- Name: lesson_learning_objective lesson_learning_objective_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson_learning_objective
    ADD CONSTRAINT lesson_learning_objective_pkey PRIMARY KEY (lesson_learning_objective_id);


--
-- Name: lesson lesson_lesson_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson
    ADD CONSTRAINT lesson_lesson_key_key UNIQUE (lesson_key);


--
-- Name: lesson lesson_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson
    ADD CONSTRAINT lesson_pkey PRIMARY KEY (lesson_id);


--
-- Name: lesson_prerequisite lesson_prerequisite_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson_prerequisite
    ADD CONSTRAINT lesson_prerequisite_pkey PRIMARY KEY (lesson_id, prerequisite_lesson_id);


--
-- Name: lesson_project_criterion lesson_project_criterion_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson_project_criterion
    ADD CONSTRAINT lesson_project_criterion_pkey PRIMARY KEY (lesson_project_criterion_id);


--
-- Name: lesson_learning_objective_lesson_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_learning_objective_lesson_id_index ON lesson_learning_objective USING btree (lesson_id);


--
-- Name: lesson_lesson_key_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_lesson_key_index ON lesson USING btree (lesson_key);


--
-- Name: lesson_prerequisite_lesson_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_prerequisite_lesson_id_index ON lesson_prerequisite USING btree (lesson_id);


--
-- Name: lesson_prerequisite_prerequisite_lesson_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_prerequisite_prerequisite_lesson_id_index ON lesson_prerequisite USING btree (prerequisite_lesson_id);


--
-- Name: lesson_project_criterion_lesson_id_index; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX lesson_project_criterion_lesson_id_index ON lesson_project_criterion USING btree (lesson_id);


--
-- Name: lesson_learning_objective lesson_learning_objective_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson_learning_objective
    ADD CONSTRAINT lesson_learning_objective_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id);


--
-- Name: lesson_prerequisite lesson_prerequisite_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson_prerequisite
    ADD CONSTRAINT lesson_prerequisite_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id);


--
-- Name: lesson_prerequisite lesson_prerequisite_prerequisite_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson_prerequisite
    ADD CONSTRAINT lesson_prerequisite_prerequisite_lesson_id_fkey FOREIGN KEY (prerequisite_lesson_id) REFERENCES lesson(lesson_id);


--
-- Name: lesson_project_criterion lesson_project_criterion_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY lesson_project_criterion
    ADD CONSTRAINT lesson_project_criterion_lesson_id_fkey FOREIGN KEY (lesson_id) REFERENCES lesson(lesson_id);


--
-- PostgreSQL database dump complete
--

