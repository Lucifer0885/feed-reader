import { getLinks, saveLinks } from './feed-manager.mjs';
import { closeInterface, rl } from './rl.mjs';
import axios from 'axios';
import Parser from 'rss-parser';
import { EventEmitter } from 'events';

const feeds = await getLinks();
const parser = new Parser();
const emitter = new EventEmitter();

function prompt() {
  rl.setPrompt(`Enter command (list, add, del, read, quit): `);
  rl.prompt();
}

rl.on('line', (input) => {
  let cmdParts = input.trim().split(' ');
  emitter.emit(cmdParts[0], cmdParts[1]);
});

emitter.on('quit', async () => {
  await saveLinks(feeds);
  closeInterface();
});

emitter.on('list', async () => {
  feeds.forEach((url, index) => console.log(`${index}\t${url}`));
  prompt();
});

emitter.on('add', async (url) => {
  if (url === undefined) {
    console.log(`Please include the url with the add command`);
  } else {
    feeds.push(url);
    console.log(`${url} has been added to the feeds list!`);
  }
  prompt();
});

emitter.on('del', async (index) => {
  if (index === undefined) {
    console.log(`Please include the index of the url you want to delete`);
  } else {
    index = parseInt(index, 10);
    if (index > -1 && index < feeds.length) {
      feeds.splice(index, 1);
      console.log(`${feeds[index]} deleted from feeds list!`);
    } else {
      console.log(`The provided index is out of range!`);
    }
  }
  prompt();
});

emitter.on('read', async (index) => {
  if (index === undefined) {
    console.log(`Please include the index of the url you want to read`);
  } else {
    index = parseInt(index, 10);

    if (index > -1 && index < feeds.length) {
      try {
        let { data } = await axios.get(feeds[index]);

        let feed = await parser.parseString(data);

        feed.items.forEach((item) => console.log(item.title));
      } catch (error) {
        console.log(`The selected url has no articles to read from.`);
      }
    } else {
      console.log(`The provided index is out of range!`);
    }
  }
  prompt();
});

prompt();
