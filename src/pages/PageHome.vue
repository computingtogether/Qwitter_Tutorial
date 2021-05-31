<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-width full-height">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            bottom-slots
            v-model="newQweetContent"
            class="new-qweet"
            placeholder="What's happening?"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://randomuser.me/api/portraits/men/10.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewQweet"
            class="q-mb-lg"
            v-bind:disable="!newQweetContent"
            unelevated
            no-caps
            rounded
            color="primary"
            label="Qweet"
          />
        </div>
      </div>
      <q-separator class="divider" color="grey-2" size="10px" />

      <q-list separator>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="qweet in qweets" :key="qweet.id" class="qweet q-py-md">
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://randomuser.me/api/portraits/men/10.jpg" />
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Sean Corey</strong>
                <span class="text-grey-7"></span>
                @computetogether
                <br class="lt-md" />&bull; {{ qweet.date | relativeDate }}
              </q-item-label>
              <q-item-label class="qweet-content text-body1">
                {{ qweet.content }}
              </q-item-label>
              <div class="qweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  color="grey"
                  size-="sm"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  color="grey"
                  size-="sm"
                  icon="fas fa-retweet"
                />
                <q-btn
                  flat
                  @click="toggleLiked(qweet)"
                  :icon="qweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                  round
                  :color="qweet.liked ? 'pink' : 'grey'"
                  size-="sm"
                />
                <q-btn
                  @click="deleteQweet(qweet)"
                  flat
                  icon="fas fa-trash"
                  round
                  color="grey"
                  size-="sm"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from "src/boot/firebase";
import { formatDistance } from "date-fns";

export default {
  name: "PageHome",
  data() {
    return {
      newQweetContent: "",
      qweets: [
        // {
        //   id: 1,
        //   content:
        //     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam nam facere quod, quam expedita aut ipsa voluptatibus, dolore optio tempora sunt ab consequatur facilis molestiae, deleniti porro blanditiis laborum dolorum!",
        //   date: 1622308441752,
        //   liked: false
        // },
        // {
        //   id: 2,
        //   content:
        //     "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam nam facere quod, quam expedita aut ipsa voluptatibus, dolore optio tempora sunt ab consequatur facilis molestiae, deleniti porro blanditiis laborum dolorum!",
        //   date: 1622308486076,
        //   liked: true
        // },
      ],
    };
  },
  methods: {
    addNewQweet() {
      let newQweet = {
        content: this.newQweetContent,
        date: Date.now(),
        liked: false,
      };

      db.collection("qweets")
        .add(newQweet)
        .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });

      // this.qweets.unshift(newQweet);
      this.newQweetContent = "";
    },
    deleteQweet(qweet) {
      db.collection("qweets")
        .doc(qweet.id)
        .delete()
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    },
    toggleLiked(qweet) {
      db.collection('qweets').doc(qweet.id).update({
        liked: !qweet.liked
      })
        .then(() => {
          console.log("Document successfully updated!");
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    },
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date());
    },
  },
  mounted() {
    db.collection("qweets")
      .orderBy("date")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          let qweetChange = change.doc.data();
          qweetChange.id = change.doc.id;
          if (change.type === "added") {
            console.log("New qweet: ", qweetChange);
            this.qweets.unshift(qweetChange);
          }
          if (change.type === "modified") {
            console.log("Modified qweet: ", qweetChange);
            let index = this.qweets.findIndex(
              (qweet) => qweet.id === qweetChange.id
            );
            Object.assign(this.qweets[index], qweetChange);
          }
          if (change.type === "removed") {
            console.log("Removed qweet: ", qweetChange);
            let index = this.qweets.findIndex(
              (qweet) => qweet.id === qweetChange.id
            );
            this.qweets.splice(index, 1);
          }
        });
      });
  },
};
</script>

<style lang="sass">
.new-qweet
  textarea
    font-size: 19px
    line-height: 1.4 !important
.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4
.qweet:not(:first-child)
  border-top: 1px solid rgba(0, 0, 0, 0.12)
.qweet-content
  white-space: pre-line
.qweet-icons
  margin-left: -5px
</style>