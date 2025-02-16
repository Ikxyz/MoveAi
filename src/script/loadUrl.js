const fs = require('fs')
const puppeteer = require('puppeteer')
const ignoreList = ['x.com', 'twitter.com', 'discord.gg']
async function fetchLinks(
  url = '',
  depth = 0,
  maxDepth = 1,
  visited = new Set(),
) {
  if (depth > maxDepth || visited.has(url)) return []

  if (ignoreList.find((e) => url.includes(e))) {
    console.log(
      `- - - - - - - - - - - - - - - - - - - - - - - - - >>>>>Ignoring: ${url}`,
    )
    return []
  }

  console.log(`Fetching: ${url} (Depth: ${depth})`)
  visited.add(url)

  let browser
  try {
    browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()

    // Set navigation timeout & wait until DOM is fully loaded
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 10000 })

    // Extract all <a> href links
    const links = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a'))
        .map((a) => a.href)
        .filter(
          (link) =>
            link && !link.startsWith('javascript') && !link.startsWith('#'),
        )
    })

    await browser.close()

    const uniqueLinks = [...new Set(links)] // Remove duplicates

    // Recursively fetch links from found pages
    const subLinks = await Promise.all(
      uniqueLinks.map((link) => fetchLinks(link, depth + 1, maxDepth, visited)),
    )

    return [...uniqueLinks, ...subLinks.flat()]
  } catch (err) {
    console.error(`Error fetching ${url}:`, err.message)
    if (browser) await browser.close()
    return []
  }
}

async function crawlLinks(startingLinks) {
  const allLinks = await Promise.all(
    startingLinks.map((link) => fetchLinks(link)),
  )
  const uniqueLinks = [...new Set(allLinks.flat())] // Remove duplicates

  // Write to file
  fs.writeFileSync('output.txt', uniqueLinks.join('\n'), 'utf8')
  console.log(`Links saved to output.txt`)

  return uniqueLinks
}

// Example usage
const links = [
  // 'https://docs.movementnetwork.xyz/devs/movementcli',
  // 'https://kit.razorwallet.xyz/',
  // 'https://connect.nightly.app/docs/movement/movement/start',
  // 'https://docs.movementnetwork.xyz/api/node/movement-labs-node-api',
  //
  'https://developer.movementnetwork.xyz',
]

crawlLinks(links)
