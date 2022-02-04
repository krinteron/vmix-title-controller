<template>
  <div class="body">
    <NavBar />
    <div>
      <div class="programs-controller">
        <form
          v-for="program in Object.keys($store.state.titles)"
          :key="$store.state.titles[program]"
          action=""
        >
          <label label="Имя программы:" for="nested-street">
            <input
              id="nested-street"
              v-model="$store.state.titles[program].programName"
            />
          </label>

          <div
            v-for="titler in Object.keys($store.state.titles[program].titlers)"
            :key="titler"
          >
            <label label="Компонент:" label-for="nested-city">
              <b-form-input
                id="nested-city"
                v-model="
                  $store.state.titles[program].titlers[titler]
                    .titlerComponentName
                "
              ></b-form-input>
            </label>
            <div
              v-for="param in Object.keys(
                $store.state.titles[program].titlers[titler].dataOrder
              )"
              :key="param"
            >
              <b-form-group
                label="Заголовок:"
                label-for="nested-state"
                label-cols-sm="3"
                label-align-sm="right"
              >
                <b-form-input
                  id="nested-state"
                  v-model="
                    $store.state.titles[program].titlers[titler].dataOrder[
                      param
                    ].name
                  "
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Имя файла:"
                label-for="nested-state"
                label-cols-sm="3"
                label-align-sm="right"
              >
                <b-form-input
                  id="nested-state"
                  v-model="
                    $store.state.titles[program].titlers[titler].dataOrder[
                      param
                    ].titleName
                  "
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Автозакрытие:"
                label-for="nested-state"
                label-cols-sm="3"
                label-align-sm="right"
              >
                <b-form-input
                  id="nested-state"
                  v-model="
                    $store.state.titles[program].titlers[titler].dataOrder[
                      param
                    ].autoClose
                  "
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="РЕГИСТР:"
                label-for="nested-state"
                label-cols-sm="3"
                label-align-sm="right"
              >
                <b-form-input
                  id="nested-state"
                  v-model="
                    $store.state.titles[program].titlers[titler].dataOrder[
                      param
                    ].upperCase
                  "
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Инпут:"
                label-for="nested-state"
                label-cols-sm="3"
                label-align-sm="right"
              >
                <b-form-input
                  id="nested-state"
                  v-model="
                    $store.state.titles[program].titlers[titler].dataOrder[
                      param
                    ].overlayInput
                  "
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <!-- 
            <b-form-group
              label="State:"
              label-for="nested-state"
              label-cols-sm="3"
              label-align-sm="right"
            >
              <b-form-input id="nested-state"></b-form-input>
            </b-form-group>

            <b-form-group
              label="Country:"
              label-for="nested-country"
              label-cols-sm="3"
              label-align-sm="right"
            >
              <b-form-input id="nested-country"></b-form-input>
            </b-form-group>

            <b-form-group
              v-slot="{ ariaDescribedby }"
              label="Ship via:"
              label-cols-sm="3"
              label-align-sm="right"
              class="mb-0"
            >
              <b-form-radio-group
                class="pt-2"
                :options="['Air', 'Courier', 'Mail']"
                :aria-describedby="ariaDescribedby"
              ></b-form-radio-group>
            </b-form-group> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      programs: this.$store.state.titles,
    };
  },
  async beforeMount() {
    await this.$store.dispatch('getVmixState');
    await this.$store.dispatch('getTitles');
    this.$store.dispatch('startStateEvent');
    this.$store.dispatch('setStateMachine');
  },
  methods: {
    // getData() {
    //   const elem = document.getElementById(id);
    // },
  },
};
</script>

<style scoped>
.body {
  width: 100vw;
  height: 100vh;
}
.programs-controller {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 20px;
}
.tabs {
  width: 100%;
}
.tab-pane {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
</style>
