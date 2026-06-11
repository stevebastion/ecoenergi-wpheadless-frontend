<script>
  export let pagination;
  export let base = ''; // e.g. "/case-studies"

  const { page, pageCount } = pagination;

  const createUrl = (p) =>
    p === 1 ? base : `${base}?page=${p}`;
</script>

{#if pageCount > 1}
  <nav class="pagination" aria-label="Pagination">
    <ul>
      <!-- Previous -->
      {#if page > 1}
        <li>
          <a href={createUrl(page - 1)} rel="prev">
            ← Previous
          </a>
        </li>
      {/if}

      <!-- Page numbers -->
      {#each Array(pageCount) as _, i}
        {#if Math.abs(page - (i + 1)) <= 2 || i === 0 || i === pageCount - 1}
          <li class:active={page === i + 1}>
            <a
              href={createUrl(i + 1)}
              aria-current={page === i + 1 ? 'page' : undefined}
            >
              {i + 1}
            </a>
          </li>
        {/if}
      {/each}

      <!-- Next -->
      {#if page < pageCount}
        <li>
          <a href={createUrl(page + 1)} rel="next">
            Next →
          </a>
        </li>
      {/if}
    </ul>
  </nav>
{/if}

<style>
.pagination {
  margin: 3rem 0;
  display: flex;
  justify-content: center;
}

.pagination ul {
  display: flex;
  gap: 0.5rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

.pagination a {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  text-decoration: none;
  color: inherit;
}

.pagination li.active a {
  background: #123053;
  color: white;
  border-color: #123053;
  pointer-events: none;
}

.pagination a:hover {
  background: #f0f0f0;
}
</style>