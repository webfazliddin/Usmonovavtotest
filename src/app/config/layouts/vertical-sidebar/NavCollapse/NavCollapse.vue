<script setup lang="ts">
import NavItem from "../NavItem/index.vue";
import Icon from "../Icon.vue";

interface IProps {
  item: any;
  level: number;
}

defineProps<IProps>();
</script>

<template>
  <div>
    <v-list-group no-action v-if="item">
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" :value="item.header" rounded class="mb-1">
          <template v-slot:prepend>
            <Icon :item="item.icon" :level="level" />
          </template>
          <v-list-item-title class="mr-auto">{{
            $t(item.header)
          }}</v-list-item-title>
        </v-list-item>
      </template>
      <template v-for="subitem in item.children" v-if="item.children">
        <NavCollapse
          :item="subitem"
          v-if="subitem.children"
          :level="level + 1"
        />
        <NavItem
          :item="subitem"
          :level="level + 1"
          v-else-if="!subitem.children"
        ></NavItem>
      </template>
    </v-list-group>
  </div>
</template>
