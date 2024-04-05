# ROOM ESCAPE HINT SYSTEM - SERVER

---

## Tech Stack

| framework  | Socket    | Database |
| ---------- | --------- | -------- |
| Express.js | Socket.io | MySQL    |

---

## Document

### Objects

<details>
<summary>
<code><b>Theme</b></code>
<code>(Theme preview info)</code>
</summary>

##### Theme

> | key         | description                                | type   | default  |
> | ----------- | ------------------------------------------ | ------ | -------- |
> | idx         | The identified number of the theme         | Int    |          |
> | name        | The name or the title of the theme         | String |          |
> | time_limit  | The theme's limit time in minutes          | Int    | `60`     |
> | icon        | The theme's icon image URL                 | String |          |
> | theme_color | The CSS color code of the theme main color | String | `'#000'` |
> | createdAt   | When the column has been created           | Date   |          |
> | updatedAt   | When the column has been updated at last   | Date   |          |

</details>

<details>
<summary>
<code><b>Play_info</b></code>
<code>(Each playing simple information)</code>
</summary>

##### Play_info

> | key         | description                                                                        | type   | default   |
> | ----------- | ---------------------------------------------------------------------------------- | ------ | --------- |
> | idx         | The identified number of the playing info                                          | Int    |           |
> | theme_idx   | The linked theme idx                                                               | Int    |           |
> | status      | `'ready'` `'play'` `'pause'` `'end'`                                               | String | `'ready'` |
> | startedAt   | The exact time of the start playing. Only available when `status` is not `'ready'` | Date   |           |
> | pausedAt    | The exact time of the last pausing.                                                | Date   |           |
> | add_sec     | Seconds will be added to the total playing time.                                   | Int    |           |
> | device_info | The socket id of the connected hint device.                                        | Int    |           |
> | createdAt   | When the column has been created                                                   | Date   |           |
> | updatedAt   | When the column has been updated at last                                           | Date   |           |

</details>

<details>
<summary>
<code><b>Player_info</b></code>
<code>(Detailed player information)</code>
</summary>

##### Player_info

> | key  | description                        | type   | default |
> | ---- | ---------------------------------- | ------ | ------- |
> | name | The name of the player             | String |         |
> | tel  | The Telephone number of the player | String |         |

</details>

<details>
<summary>
<code><b>setting</b></code>
<code>(A single Configuration)</code>
</summary>

##### setting

> | key   | description  | type   | default |
> | ----- | ------------ | ------ | ------- |
> | label | config label | String |         |
> | value | config value | String |         |

</details>

<details>
<summary>
<code><b>hint</b></code>
<code>(A single hint information including contents)</code>
</summary>

> | key      | description                                            | type   | default |
> | -------- | ------------------------------------------------------ | ------ | ------- |
> | idx      | The identified number of the hint                      | Int    |         |
> | code     | Hint code                                              | String |         |
> | progress | Progress of the hint for the whole theme (%)           | Float  |         |
> | contents | Each element contains `contents(String)`, `step(Int)`. | Array  |         |

</details>

### Themes

<details>

<summary>
<code>POST</code>
<code><b>/theme</b></code>
<code>(Create a new empty theme info)</code>
</summary>

##### Headers

> | name          | required | data type | description |
> | ------------- | -------- | --------- | ----------- |
> | Authorization | Y        | String    |             |

##### Parameters

> | name | required | data type | description                          |
> | ---- | -------- | --------- | ------------------------------------ |
> | name | Y        | String    | The theme title (default `"DPSNNN"`) |

##### Responses

> | http code | content-type               | response                                  |
> | --------- | -------------------------- | ----------------------------------------- |
> | `201`     | `text/plain;charset=UTF-8` | [Theme](#Theme)                           |
> | `401`     | `application/json`         | `{"code":"401","message":"Anauthorized"}` |

</details>
