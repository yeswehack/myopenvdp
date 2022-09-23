<template>
  <q-page
    padding
    class="row"
  >
    <vdp-form
      :captcha-provider="captchaProvider"
      :pgp-key="pgpKeys"
      :attachment-max-size-bytes="4 * 1024 * 1024"
      :attachment-allowed-extensions="extensions"
      disclosure-policy-notification-position="bottom-left"
      success-notification-position="top-right"
      errors-notification-position="top-right"
      @submit="logSubmit"
    />
  </q-page>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { VdpForm } from 'ui';
async function captchaProvider() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return await fetch('https://vdp-form-backend.localhost/api/captcha?w=200&h=56').then((response) => response.json());
}
const extensions = ref('jpeg jpg png gif tiff bmp txt json pdf'.split(' '));
const pgpKeys = ref([
  {
    name: 'PGP Key 1',
    key: `-----BEGIN PGP PUBLIC KEY BLOCK-----

mQGNBGKxuBsBDAC0qZMBlhYaa2ruhp88GwkMuCOrW1rQY6DfkORvKjetwvwxMwBJ
N2DYoqJFSx9wbPEh7tkkFNedx10MiF+AoOQpufFnwpR5b3jX7ZhCExgjP3nCHNOO
adqQ4cWRjsEdIhCzvbmFXNiBO3jcI4dkgG27zDsTz1UuYc9euwjSf6RvppJEn7DS
1w/qfeOWK+/QXFnmcoZqA3D+3kJC83BboW8iG/eFBJ4YCM9ea4BkFpfgYg/LShn2
EyUPhRAiundrQI0H7Vku9iCtlhzNCczVOHUJgTxPL3HCg3sLy7uku9FDS2db2hvz
vo3v0kf6RMVGBr8jYYYuoOTBGYOvUyuwUm8w/bkbdahpt2fmAcHAdwH5wtpKDmCK
0x4GxBrPrYsHpxScxwK6UeHMgxcTbPjr61qVeeGLdlRGzY77abd55fN1xOEecIaW
37TbNhtmlLkWWGKa5S/Af7ANP1urKZXCWt6LIonwV1IJRchztngTCIqfceY2SOfs
1tHTl4wl5Bxh/5UAEQEAAbQvT3BlblZEUFRlc3QgPG0uaG9uZWwrb3BlbnZkcHRl
c3RAeWVzd2VoYWNrLmNvbT6JAdQEEwEKAD4WIQSqyWWVn9vAgux2bU0IaJu8bQyH
zgUCYrG4GwIbAwUJA8JnAAULCQgHAgYVCgkICwIEFgIDAQIeAQIXgAAKCRAIaJu8
bQyHzmbSDACnil9IJsbjwFfSrp/sQvtWDs1XuEONyaawRSQy9/x32x+FKxDlL/Hh
hus/vnt78i6j3EZ8yso0hI09idrV76/bY9YHwa3kpw5aWQ3C2i3teaXu2NKYXfML
aonFFCrTjVJOLKUfi3eIBwfpbN92J8GIMXl2uA8lDSWqhhluyRyvx085/9Q1aQ2L
+IjlYeBgu8HxeEi+GKa8RH9EYI9C6m5Tb8Kb4ydkCwepWSsg+KptSCHIQDCfw5+p
y11o8g2TEpZpvu1rrQXWCdGbWsWWRuYy2uuEMjG6Fx6KEhu/xVRcy/W9iBNb4P6l
wuwKvHH48pPKjlZpVUaqm4CFpqr4KDlnpi+PZKVtHPMtpRk/gvan1QtqiUxpaobI
QwC7ovuXY25fDdKtcqT0Iyo/BlqmYK0OtXNdUID89fEbEldmFmWDit4CvUKlDJq6
2w4TWAPCX5BGZ2z/DRhxO+LOl38w3V35DOMGl/7NkMhFnihRLvTCkkoNd75Dw2k3
ckaQu/I1dee5AY0EYrG4GwEMAOhcSHFnPtQs9zTW6Th/q2NxvAqblR/ubJ35SKIP
o80/P56pZ5lHvnchH6Hi5VlpMaNMb74A55pLbBqMR+zVa6cyCPDRo3ExSJdkcX1B
plr+yomruxJ9h2Y2cNu57f+bYvOf9VV3/Kf1a3GSAcqv06CnKKVRjBztxf/xFVn5
h3R3qh2GjqcWV0BpJcqjreR5sfh+XGb4E2Qw3fbCjhTyw513WscQx0CMbIwz8sde
nxBD3VbDYKq4cLc1ehr8rklVGGPAJ7Er16ozAMLhttsF21fvs6T8Yke4B0Y5EWHL
I1brhJDhpTvLlrnOKw+S/CedkheRSHe4H4yf0adpZ3aqmq3Z1l9GZsnL7ckheLoS
GxOFX3R+2wpnXi9Goe2udinr8EVEiysnldHGaFUrjBuRrzn7ykl7kY1a4PwgGWjm
z4VNhv9I8+bRltAAEydK5RjEMgF4vLA3YtEZJKblEpamKAFY2djf6c247jTJCi7m
pT9mlzZGDawyaSEbHIIZDJ5t3QARAQABiQG8BBgBCgAmFiEEqslllZ/bwILsdm1N
CGibvG0Mh84FAmKxuBsCGwwFCQPCZwAACgkQCGibvG0Mh86+9Qv/Q+w24gi5OUsa
aiR+qdLoENB9cIgqtAz51BaFQU7gWipVt+DySD4n1mRnUT5Ok0SWuVhHXV6EyqIg
GHpSJm6coMOJPMSc+7I2zTwYkHzDsEhdpaJtAy5ai2IIye8rjol2ogQDVKLr191l
T/BYny+kRVSKZLfOshIlNQlJhRyC9bV8NCdZTDW5uK/huTITqDKqfe98byPyfvqy
umTOHsGycLY0HJWKV1BKyvhgqh4ZX8qDV7Ou4c+IECE86F517kHY4bqQ2YUBH5sM
ntJJvN9UK9lH6ypBgJfSGfHCBiOdfSo2YjuK95QZUt4GIJrbaFTEb5tpaeKtl4dh
4/zCwtm+KorHVnzGYiLgcJMhybe6vK6YU9vfOY4Ap38E9HX9Tq8nBklI08lQNPaY
ACLhTZ0Y9GKAN1+V0KB6dqgE3MHZAw1NZRDTnlfN3M345fj/Ypg09gw5KzAAtFVa
rCHIDOh1bOdGsOYVS9BaSuhPtwf/zYAC9VA+mI2qzQJji7thrBsx
=wicI
-----END PGP PUBLIC KEY BLOCK-----`,
  },
  {
    name: 'PGP Key 2',
    key: `-----BEGIN PGP PUBLIC KEY BLOCK-----

mQGNBGKxuBsBDAC0qZMBlhYaa2ruhp88GwkMuCOrW1rQY6DfkORvKjetwvwxMwBJ
N2DYoqJFSx9wbPEh7tkkFNedx10MiF+AoOQpufFnwpR5b3jX7ZhCExgjP3nCHNOO
adqQ4cWRjsEdIhCzvbmFXNiBO3jcI4dkgG27zDsTz1UuYc9euwjSf6RvppJEn7DS
1w/qfeOWK+/QXFnmcoZqA3D+3kJC83BboW8iG/eFBJ4YCM9ea4BkFpfgYg/LShn2
EyUPhRAiundrQI0H7Vku9iCtlhzNCczVOHUJgTxPL3HCg3sLy7uku9FDS2db2hvz
vo3v0kf6RMVGBr8jYYYuoOTBGYOvUyuwUm8w/bkbdahpt2fmAcHAdwH5wtpKDmCK
0x4GxBrPrYsHpxScxwK6UeHMgxcTbPjr61qVeeGLdlRGzY77abd55fN1xOEecIaW
37TbNhtmlLkWWGKa5S/Af7ANP1urKZXCWt6LIonwV1IJRchztngTCIqfceY2SOfs
1tHTl4wl5Bxh/5UAEQEAAbQvT3BlblZEUFRlc3QgPG0uaG9uZWwrb3BlbnZkcHRl
c3RAeWVzd2VoYWNrLmNvbT6JAdQEEwEKAD4WIQSqyWWVn9vAgux2bU0IaJu8bQyH
zgUCYrG4GwIbAwUJA8JnAAULCQgHAgYVCgkICwIEFgIDAQIeAQIXgAAKCRAIaJu8
bQyHzmbSDACnil9IJsbjwFfSrp/sQvtWDs1XuEONyaawRSQy9/x32x+FKxDlL/Hh
hus/vnt78i6j3EZ8yso0hI09idrV76/bY9YHwa3kpw5aWQ3C2i3teaXu2NKYXfML
aonFFCrTjVJOLKUfi3eIBwfpbN92J8GIMXl2uA8lDSWqhhluyRyvx085/9Q1aQ2L
+IjlYeBgu8HxeEi+GKa8RH9EYI9C6m5Tb8Kb4ydkCwepWSsg+KptSCHIQDCfw5+p
y11o8g2TEpZpvu1rrQXWCdGbWsWWRuYy2uuEMjG6Fx6KEhu/xVRcy/W9iBNb4P6l
wuwKvHH48pPKjlZpVUaqm4CFpqr4KDlnpi+PZKVtHPMtpRk/gvan1QtqiUxpaobI
QwC7ovuXY25fDdKtcqT0Iyo/BlqmYK0OtXNdUID89fEbEldmFmWDit4CvUKlDJq6
2w4TWAPCX5BGZ2z/DRhxO+LOl38w3V35DOMGl/7NkMhFnihRLvTCkkoNd75Dw2k3
ckaQu/I1dee5AY0EYrG4GwEMAOhcSHFnPtQs9zTW6Th/q2NxvAqblR/ubJ35SKIP
o80/P56pZ5lHvnchH6Hi5VlpMaNMb74A55pLbBqMR+zVa6cyCPDRo3ExSJdkcX1B
plr+yomruxJ9h2Y2cNu57f+bYvOf9VV3/Kf1a3GSAcqv06CnKKVRjBztxf/xFVn5
h3R3qh2GjqcWV0BpJcqjreR5sfh+XGb4E2Qw3fbCjhTyw513WscQx0CMbIwz8sde
nxBD3VbDYKq4cLc1ehr8rklVGGPAJ7Er16ozAMLhttsF21fvs6T8Yke4B0Y5EWHL
I1brhJDhpTvLlrnOKw+S/CedkheRSHe4H4yf0adpZ3aqmq3Z1l9GZsnL7ckheLoS
GxOFX3R+2wpnXi9Goe2udinr8EVEiysnldHGaFUrjBuRrzn7ykl7kY1a4PwgGWjm
z4VNhv9I8+bRltAAEydK5RjEMgF4vLA3YtEZJKblEpamKAFY2djf6c247jTJCi7m
pT9mlzZGDawyaSEbHIIZDJ5t3QARAQABiQG8BBgBCgAmFiEEqslllZ/bwILsdm1N
CGibvG0Mh84FAmKxuBsCGwwFCQPCZwAACgkQCGibvG0Mh86+9Qv/Q+w24gi5OUsa
aiR+qdLoENB9cIgqtAz51BaFQU7gWipVt+DySD4n1mRnUT5Ok0SWuVhHXV6EyqIg
GHpSJm6coMOJPMSc+7I2zTwYkHzDsEhdpaJtAy5ai2IIye8rjol2ogQDVKLr191l
T/BYny+kRVSKZLfOshIlNQlJhRyC9bV8NCdZTDW5uK/huTITqDKqfe98byPyfvqy
umTOHsGycLY0HJWKV1BKyvhgqh4ZX8qDV7Ou4c+IECE86F517kHY4bqQ2YUBH5sM
ntJJvN9UK9lH6ypBgJfSGfHCBiOdfSo2YjuK95QZUt4GIJrbaFTEb5tpaeKtl4dh
4/zCwtm+KorHVnzGYiLgcJMhybe6vK6YU9vfOY4Ap38E9HX9Tq8nBklI08lQNPaY
ACLhTZ0Y9GKAN1+V0KB6dqgE3MHZAw1NZRDTnlfN3M345fj/Ypg09gw5KzAAtFVa
rCHIDOh1bOdGsOYVS9BaSuhPtwf/zYAC9VA+mI2qzQJji7thrBsx
=wicI
-----END PGP PUBLIC KEY BLOCK-----`,
  },
]);
function logSubmit(
  payload: {
    captcha: unknown;
    report: unknown;
  },
  success: (message?: string) => void,
  failure: (message?: string) => void
) {
  const body = new FormData();
  body.append('captcha', JSON.stringify(payload.captcha));
  body.append('report', JSON.stringify(payload.report));
  const config: RequestInit = {
    method: 'POST',
    body,
  };
  fetch('https://vdp-form-backend.localhost/api/upload/captcha', config)
    .then(async (response) => {
      if (!response.ok) {
        throw await response.text();
      }
    })
    .then(() => success('Thanks for your report submission!'))
    .catch((reason) => failure(reason as string));
}
</script>
