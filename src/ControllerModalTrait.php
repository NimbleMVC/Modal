<?php

namespace Nimblephp\modal;

use Nimblephp\framework\Exception\NimbleException;

trait ControllerModalTrait
{

    /**
     * Modal config
     * @var array
     */
    protected array $_modalConfig = [
        'title' => null,
        'size' => null,
        'fullscreen' => false
    ];

    /**
     * Set modal title
     * @param string $name
     * @return void
     */
    public function setModalTitle(string $name): void
    {
        $this->_modalConfig['title'] = $name;
    }

    /**
     * Set modal size
     * @param string $size
     * @return void
     * @throws NimbleException
     */
    public function setModalSize(string $size): void
    {
        if (!in_array($size, ['xl', 'lg', 'sm'])) {
            throw new NimbleException('Avaliable modal size: xl, lg, sm', 500);
        }

        $this->_modalConfig['size'] = $size;
    }

    /**
     * Set modal fullscreen mode
     * @param bool $fullscreen
     * @return void
     */
    public function setModalFullscreen(bool $fullscreen): void
    {
        $this->_modalConfig['fullscreen'] = $fullscreen;
    }

    /**
     * Render modal config in header
     * @return void
     */
    public function renderModalConfigHeader(): void
    {
        header('X-Modal-Config: ' . base64_encode(json_encode($this->_modalConfig)));
    }

}